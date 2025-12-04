import { textureBasedProgram } from "../shaders/shaders";
import { gl } from "../webgl/context";
import { ShaderProgram } from "../webgl/shaderProgram";
import { Transform } from "../utils/transform";
import { transform, vector3ToVec3 } from "../utils/vec";
import { cube, Volume } from "../models/models";
import { ColorMaps, Texture } from "../models/colorMaps";
import { Camera } from "../utils/camera";
import { vec3 } from "gl-matrix";
import Mesh from "3d-game-engine-canvas/src/utilities/Mesh";
import ClippingPlane from "3d-game-engine-canvas/src/utilities/ClippingPlane";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";

export class TextureBasedProgram extends ShaderProgram {
    mesh: Mesh;
    transparent: boolean = true;
    numberOfSlices: number = 64;

    constructor(
        public transform: Transform,
        public volume: Volume,
        public colorMap: Texture = ColorMaps.hot,
        public enableMaxValueSampling: boolean = true
    ) {
        super(textureBasedProgram);
        this.mesh = cube;
    }

    getDistanceToCamera(): number {
        const dx = this.transform._position.x - Camera.camera.position.x;
        const dy = this.transform._position.y - Camera.camera.position.y;
        const dz = this.transform._position.z - Camera.camera.position.z;
        return dx * dx + dy * dy + dz * dz;
    }

    private generateViewAlignedSlices(
        numSlices: number,
        lookAtMatrix: Float32Array<ArrayBufferLike>,
        translationMatrix: Float32Array<ArrayBufferLike>
    ): [Float32Array, Array<[number, number]>] {
        const slices: Array<Array<number>> = [];

        const vertexes = this.mesh.getVertices().map((pos) => {
            const vec = vector3ToVec3(pos);
            vec3.transformMat4(vec, vec, translationMatrix);
            vec3.transformMat4(vec, vec, lookAtMatrix);
            return vec;
        });

        const [minZ, maxZ] = vertexes.reduce(
            (acc, v) => {
                if (v[2] < acc[0]) acc[0] = v[2];
                if (v[2] > acc[1]) acc[1] = v[2];
                return acc;
            },
            [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
        );

        for (let i = 0; i < numSlices; i++) {
            const z = minZ + ((maxZ - minZ) * (i + 0.5)) / numSlices; // +0.5 to center the slice

            const sliceVertices: Vector3[] = [];

            const plane = new ClippingPlane(Vector3.forward, -z);

            for (let j = 0; j < vertexes.length; j += 3) {
                const v0 = new Vector3(
                    vertexes[j][0],
                    vertexes[j][1],
                    vertexes[j][2]
                );
                const v1 = new Vector3(
                    vertexes[j + 1][0],
                    vertexes[j + 1][1],
                    vertexes[j + 1][2]
                );
                const v2 = new Vector3(
                    vertexes[j + 2][0],
                    vertexes[j + 2][1],
                    vertexes[j + 2][2]
                );

                const d0 = plane.distance(v0);
                const d1 = plane.distance(v1);
                const d2 = plane.distance(v2);
                if (
                    (d0 >= 0 && d1 >= 0 && d2 < 0) ||
                    (d0 < 0 && d1 < 0 && d2 >= 0)
                ) {
                    const t02 = plane.computeT(v0, v2);
                    const t12 = plane.computeT(v1, v2);
                    const v02 = plane.intersection(v0, v2, t02);
                    const v12 = plane.intersection(v1, v2, t12);
                    sliceVertices.push(v02, v12);
                } else if (
                    (d0 >= 0 && d1 < 0 && d2 >= 0) ||
                    (d0 < 0 && d1 >= 0 && d2 < 0)
                ) {
                    const t01 = plane.computeT(v0, v1);
                    const t12 = plane.computeT(v1, v2);
                    const v01 = plane.intersection(v0, v1, t01);
                    const v12 = plane.intersection(v1, v2, t12);
                    sliceVertices.push(v01, v12);
                } else if (
                    (d0 < 0 && d1 >= 0 && d2 >= 0) ||
                    (d0 >= 0 && d1 < 0 && d2 < 0)
                ) {
                    const t01 = plane.computeT(v0, v1);
                    const t02 = plane.computeT(v0, v2);
                    const v01 = plane.intersection(v0, v1, t01);
                    const v02 = plane.intersection(v0, v2, t02);
                    sliceVertices.push(v01, v02);
                }
            }
            const origin = sliceVertices[0];
            const triangles = [];
            for (let k = 1; k < sliceVertices.length; k++) {
                triangles.push(
                    origin,
                    sliceVertices[k],
                    sliceVertices[k + 1 >= sliceVertices.length ? 1 : k + 1]
                );
            }
            slices.push(triangles.map((v) => [v.x, v.y, v.z]).flat());
        }
        const length = slices.map((ele) => ele.length);
        const offsets_length: Array<[number, number]> = [];
        let offset = 0;
        for (let i = 0; i < length.length; i++) {
            offsets_length.push([offset, length[i]]);
            offset += length[i];
        }

        return [new Float32Array(slices.flat()), offsets_length];
    }

    init() {
        const { lookAtMatrix, translationMatrix } = transform(this.transform);
        const [data, _offset] = this.generateViewAlignedSlices(
            this.numberOfSlices * 2,
            lookAtMatrix,
            translationMatrix
        );
        this.makeAttribute("a_position", data, gl.DYNAMIC_DRAW);
        this.makeUniform("u_matrix_projection");
        this.makeUniform("u_matrix_camera_translation");
        this.makeUniform("u_matrix_translation");
        this.makeUniform("u_volume_size");
        this.makeUniform("u_enable_max_value_sampling");
        this.makeTexture2D("transfer_fn", this.colorMap);
        this.makeTexture3D("volume", this.volume);
    }

    draw() {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.CULL_FACE);
        gl.useProgram(this.program);

        const { lookAtMatrix, perspectiveMatrix, translationMatrix } =
            transform(this.transform);

        gl.uniformMatrix4fv(
            this.uniformsLocations["u_matrix_projection"],
            false,
            perspectiveMatrix
        );

        gl.uniformMatrix4fv(
            this.uniformsLocations["u_matrix_camera_translation"],
            false,
            lookAtMatrix
        );

        gl.uniformMatrix4fv(
            this.uniformsLocations["u_matrix_translation"],
            false,
            translationMatrix
        );

        gl.uniform3iv(
            this.uniformsLocations["u_volume_size"],
            new Int32Array([
                this.volume.size.x,
                this.volume.size.y,
                this.volume.size.z,
            ])
        );

        gl.uniform1i(
            this.uniformsLocations["u_enable_max_value_sampling"],
            this.enableMaxValueSampling ? 1 : 0
        );

        gl.uniform1i(
            this.textures["volume"].location,
            this.textures["volume"].unit
        );
        gl.uniform1i(
            this.textures["transfer_fn"].location,
            this.textures["transfer_fn"].unit
        );

        gl.activeTexture(gl.TEXTURE0 + this.textures["volume"].unit);
        gl.bindTexture(gl.TEXTURE_3D, this.textures["volume"].texture);

        gl.activeTexture(gl.TEXTURE0 + this.textures["transfer_fn"].unit);
        gl.bindTexture(gl.TEXTURE_2D, this.textures["transfer_fn"].texture);

        const [data, offsets] = this.generateViewAlignedSlices(
            this.numberOfSlices,
            lookAtMatrix,
            translationMatrix
        );
        this.updateAttribute("a_position", data);
        const a_vertex = this.attributes["a_position"];
        gl.enableVertexAttribArray(a_vertex.location);
        gl.bindBuffer(gl.ARRAY_BUFFER, a_vertex.buffer);

        offsets.forEach(([offset, length]) => {
            const size = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            gl.vertexAttribPointer(
                a_vertex.location,
                size,
                type,
                normalize,
                stride,
                offset * 4 //for Float32
            );

            const primitiveType = gl.TRIANGLES;
            gl.drawArrays(primitiveType, 0, length);
        });
        gl.enable(gl.CULL_FACE);
    }
}

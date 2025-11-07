import { raymarchingProgram } from "../shaders/shaders";
import { gl } from "../webgl/context";
import { ShaderProgram } from "../webgl/shaderProgram";
import { Transform } from "../utils/transform";
import { transform } from "../utils/vec";
import { cube, toVertexArray, Volume } from "../models/models";
import { ColorMaps, Texture } from "../models/colorMaps";

export class RaymarchingProgram extends ShaderProgram {
    mesh: Float32Array<ArrayBuffer>;

    constructor(
        public transform: Transform,
        public volume: Volume,
        public colorMap: Texture = ColorMaps.hot
    ) {
        super(raymarchingProgram);
        this.mesh = toVertexArray(cube);
        console.log(colorMap);
    }

    init() {
        this.makeAttribute("a_position", this.mesh, gl.STATIC_DRAW);
        this.makeUniform("u_matrix_projection");
        this.makeUniform("u_matrix_camera_translation");
        this.makeUniform("u_matrix_translation");
        this.makeUniform("u_volume_size");
        this.makeTexture2D("transfer_fn", this.colorMap);
        this.makeTexture3D("volume", this.volume);
    }

    draw() {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.cullFace(gl.FRONT);
        gl.useProgram(this.program);

        const a_vertex = this.attributes["a_position"];
        gl.enableVertexAttribArray(a_vertex.location);
        gl.bindBuffer(gl.ARRAY_BUFFER, a_vertex.buffer);

        const size = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(
            a_vertex.location,
            size,
            type,
            normalize,
            stride,
            offset
        );

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

        const primitiveType = gl.TRIANGLES;
        const count = this.mesh.length;
        gl.drawArrays(primitiveType, offset, count);
        gl.cullFace(gl.BACK);
    }
}

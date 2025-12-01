import { basicProgram } from "../shaders/shaders";
import { gl } from "../webgl/context";
import { ShaderProgram } from "../webgl/shaderProgram";
import { Transform } from "../utils/transform";
import { colorToFloat32Array, transform } from "../utils/vec";
import Color from "3d-game-engine-canvas/src/utilities/math/Color";
import Mesh from "3d-game-engine-canvas/src/utilities/Mesh";
import { toVertexArray } from "../models/models";

export class BasicProgram extends ShaderProgram {
    constructor(
        public transform: Transform,
        public mesh: Mesh,
        public color: Color = Color.random()
    ) {
        super(basicProgram);
    }

    init() {
        const [vertexArray, normalArray] = toVertexArray(this.mesh);
        this.makeAttribute("a_position", vertexArray, gl.STATIC_DRAW);
        this.makeAttribute("a_normal", normalArray, gl.STATIC_DRAW);
        this.makeUniform("u_matrix");
        this.makeUniform("u_color");
        this.makeUniform("u_lightPos");
        this.makeUniform("u_ambientLight");
        this.makeUniform("u_lightColor");
        this.makeUniform("u_ambientColor");
    }

    draw() {
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

        const a_normal = this.attributes["a_normal"];
        gl.enableVertexAttribArray(a_normal.location);
        gl.bindBuffer(gl.ARRAY_BUFFER, a_normal.buffer);
        gl.vertexAttribPointer(
            a_normal.location,
            size,
            type,
            normalize,
            stride,
            offset
        );

        const { uniformMatrix } = transform(this.transform);

        gl.uniformMatrix4fv(
            this.uniformsLocations["u_matrix"],
            false,
            uniformMatrix
        );

        gl.uniform4fv(
            this.uniformsLocations["u_color"],
            colorToFloat32Array(this.color.copy().normalize())
        );

        gl.uniform3fv(
            this.uniformsLocations["u_lightPos"],
            new Float32Array([5, 10, 5])
        );

        gl.uniform1fv(
            this.uniformsLocations["u_ambientLight"],
            new Float32Array([0.2])
        );

        gl.uniform4fv(
            this.uniformsLocations["u_lightColor"],
            colorToFloat32Array(Color.white.copy().normalize())
        );

        gl.uniform4fv(
            this.uniformsLocations["u_ambientColor"],
            colorToFloat32Array(Color.white.copy().normalize())
        );

        const primitiveType = gl.TRIANGLES;
        const count = this.mesh.triangles.length * 3;
        gl.drawArrays(primitiveType, offset, count);
    }
}

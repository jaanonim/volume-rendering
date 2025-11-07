import { basicProgram } from "../shaders/shaders";
import { gl } from "../webgl/context";
import { ShaderProgram } from "../webgl/shaderProgram";
import { Transform } from "../utils/transform";
import { colorToFloat32Array, transform } from "../utils/vec";
import Color from "3d-game-engine-canvas/src/utilities/math/Color";

export class BasicProgram extends ShaderProgram {
    constructor(
        public transform: Transform,
        public mesh: Float32Array,
        public color: Color = Color.random()
    ) {
        super(basicProgram);
    }

    init() {
        this.makeAttribute("a_position", this.mesh, gl.STATIC_DRAW);
        this.makeUniform("u_matrix");
        this.makeUniform("u_color");
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

        const primitiveType = gl.TRIANGLES;
        const count = this.mesh.length;
        gl.drawArrays(primitiveType, offset, count);
    }
}

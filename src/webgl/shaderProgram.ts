import { gl } from "./context";

export class ShaderProgram {
    program: WebGLProgram;
    attributes: { [key: string]: { location: number; buffer: WebGLBuffer } };
    uniformsLocations: { [key: string]: WebGLUniformLocation | null };

    makeAttribute(name: string, data: Float32Array, usage: GLenum) {
        const location = gl.getAttribLocation(this.program, name);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        this.attributes[name] = {
            location,
            buffer,
        };
    }
    makeUniform(name: string) {
        this.uniformsLocations[name] = gl.getUniformLocation(
            this.program,
            name
        );
    }

    constructor(program: WebGLProgram) {
        this.program = program;
        this.attributes = {};
        this.uniformsLocations = {};
    }

    init(): void {}

    draw(): void {}
}

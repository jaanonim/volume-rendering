import { gl } from "./context.ts";

export function makeProgram(
    fragmentShader: WebGLShader,
    vertexShader: WebGLShader
): WebGLProgram {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        const msg = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error(`${msg}`);
    }
    return program;
}

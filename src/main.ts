import "./style.css";
import { gl } from "./webgl/context.ts";
import { basicProgram } from "./shaders/shaders.ts";

function init(): RenderArgs | undefined {
    const positionAttributeLocation = gl.getAttribLocation(
        basicProgram,
        "a_position"
    );
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    /* prettier-ignore*/
    const positions = [
        0, 0,
        0, 0.5,
        0.7, 0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return { positionAttributeLocation, positionBuffer };
}

interface RenderArgs {
    positionAttributeLocation: number;
    positionBuffer: WebGLBuffer;
}
function render({ positionAttributeLocation, positionBuffer }: RenderArgs) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(basicProgram);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const size = 2; // 2 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset
    );

    const primitiveType = gl.TRIANGLES;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

function main() {
    render(init()!);
}

main();

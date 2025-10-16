import { gl } from "./context";
import type { ShaderProgram } from "./shaderProgram";

export default class Renderer {
    static deltaTime: number = 1;

    public update: () => void;
    public start: () => void;

    constructor(public shaderPrograms: Array<ShaderProgram>) {
        this.update = () => {};
        this.start = () => {};
    }

    setUpdate(update: () => void) {
        this.update = update;
        return this;
    }

    setStart(start: () => void) {
        this.start = start;
        return this;
    }

    run() {
        this.shaderPrograms.forEach((p) => {
            p.init();
        });
        this.start();
        this.draw();
        return this;
    }

    draw() {
        const start = performance.now();
        this.update();

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        this.shaderPrograms.forEach((p) => {
            p.draw();
        });

        Renderer.deltaTime = performance.now() - start;

        requestAnimationFrame(() => this.draw());
    }
}

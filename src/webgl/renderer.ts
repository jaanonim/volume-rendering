import { gl } from "./context";
import type { ShaderProgram } from "./shaderProgram";

export default class Renderer {
    static deltaTime: number = 1;
    public opaqueShaderPrograms: Array<ShaderProgram>;
    public transparentShaderPrograms: Array<ShaderProgram>;
    public toDestroy: boolean = false;

    public update: () => void;
    public start: () => void;

    constructor(shaderPrograms: Array<ShaderProgram>) {
        this.update = () => {};
        this.start = () => {};
        this.opaqueShaderPrograms = shaderPrograms.filter(
            (p) => !p.transparent
        );
        this.transparentShaderPrograms = shaderPrograms.filter(
            (p) => p.transparent
        );
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
        this.opaqueShaderPrograms.forEach((p) => {
            p.init();
        });
        this.transparentShaderPrograms.forEach((p) => {
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
        gl.enable(gl.DITHER);

        this.opaqueShaderPrograms.forEach((p) => {
            p.draw();
        });
        this.transparentShaderPrograms
            .sort((a, b) => {
                return b.getDistanceToCamera() - a.getDistanceToCamera();
            })
            .forEach((p) => {
                p.draw();
            });

        Renderer.deltaTime = performance.now() - start;

        requestAnimationFrame(() => {
            if (!this.toDestroy) {
                this.draw();
            } else {
                this.finishDestroy();
            }
        });
    }

    destroy() {
        this.toDestroy = true;
    }

    finishDestroy() {
        this.update = () => {};
        this.start = () => {};
    }
}

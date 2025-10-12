class Context {
    public gl: WebGL2RenderingContext;

    constructor() {
        const canvas = document.getElementById("root") as HTMLCanvasElement;
        const gl = canvas.getContext("webgl2");
        this.gl = gl!;
        if (gl === null) {
            alert("Cannot get webgl2 context");
            return;
        }
    }
}

const ctx = new Context();
export default ctx;
export const gl = ctx.gl;

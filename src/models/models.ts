import ObjLoader from "3d-game-engine-canvas/src/tools/ObjLoader.ts";
import cubeSrc from "./cube.obj?raw";
import teapotSrc from "./teapot.obj?raw";
import Mesh from "3d-game-engine-canvas/src/utilities/Mesh";

export const cube = new ObjLoader(cubeSrc).parse();
export const teapot = new ObjLoader(teapotSrc).parse();

export function toVertexArray(model: Mesh): Float32Array<ArrayBuffer> {
    const list = model.triangles.flatMap((t) =>
        t.vertices.flatMap((v) => [v.x, v.y, v.z])
    );
    return new Float32Array(list);
}

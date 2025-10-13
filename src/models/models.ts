import ObjLoader from "3d-game-engine-canvas/src/tools/ObjLoader.ts";
import cubeSrc from "./cube.obj?raw";
import teapotSrc from "./teapot.obj?raw";

export const cube = new ObjLoader(cubeSrc).parse();
export const teapot = new ObjLoader(teapotSrc).parse();

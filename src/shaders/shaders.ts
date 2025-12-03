import { gl } from "../webgl/context";

import { makeProgram } from "../webgl/program";
import { makeShader } from "../webgl/shader";
import basicFragSrc from "./basic/frag.glsl?raw";
import basicVertSrc from "./basic/vert.glsl?raw";
import raymarchingFragSrc from "./raymarching/frag.glsl?raw";
import raymarchingVertSrc from "./raymarching/vert.glsl?raw";
import textureBasedFragSrc from "./textureBased/frag.glsl?raw";
import textureBasedVertSrc from "./textureBased/vert.glsl?raw";

export const basicFrag = makeShader(gl.FRAGMENT_SHADER, basicFragSrc);
export const basicVert = makeShader(gl.VERTEX_SHADER, basicVertSrc);
export const basicProgram = makeProgram(basicFrag, basicVert);

export const raymarchingFrag = makeShader(
    gl.FRAGMENT_SHADER,
    raymarchingFragSrc
);
export const raymarchingVert = makeShader(gl.VERTEX_SHADER, raymarchingVertSrc);
export const raymarchingProgram = makeProgram(raymarchingFrag, raymarchingVert);

export const textureBasedFrag = makeShader(
    gl.FRAGMENT_SHADER,
    textureBasedFragSrc
);
export const textureBasedVert = makeShader(
    gl.VERTEX_SHADER,
    textureBasedVertSrc
);
export const textureBasedProgram = makeProgram(
    textureBasedFrag,
    textureBasedVert
);

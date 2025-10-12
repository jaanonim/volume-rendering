import { gl } from "../webgl/context";

import { makeProgram } from "../webgl/program";
import { makeShader } from "../webgl/shader";
import basicFragSrc from "./basic/frag.glsl?raw";
import basicVertSrc from "./basic/vert.glsl?raw";

export const basicFrag = makeShader(gl.FRAGMENT_SHADER, basicFragSrc);
export const basicVert = makeShader(gl.VERTEX_SHADER, basicVertSrc);
export const basicProgram = makeProgram(basicFrag, basicVert);

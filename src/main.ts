import "./style.css";
import { Transform } from "./utils/transformations.ts";
import Renderer from "./webgl/renderer.ts";
import { BasicProgram } from "./programs/basicProgram.ts";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3.ts";

const t = Transform.zero()
    .scale(new Vector3(0.3, 0.3, 0.3))
    .move(new Vector3(0, 0, -2));
const b = new BasicProgram(t);
const r = new Renderer([b]);
r.setUpdate(() => {
    t.rotate(new Vector3(5, 8, 12).multiply(Renderer.deltaTime));
});
r.run();

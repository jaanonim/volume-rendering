import "./style.css";
import { Transform } from "./utils/transformations.ts";
import Renderer from "./webgl/renderer.ts";
import { BasicProgram } from "./programs/basicProgram.ts";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3.ts";

const t = Transform.zero()
    .scale(new Vector3(0.3, 0.3, 0.3))
    .move(new Vector3(0, 0, -2));
const b = new BasicProgram(t);

const t2 = Transform.zero()
    .scale(new Vector3(0.3, 0.3, 0.3))
    .rotate(new Vector3(90, 56, 135))
    .move(new Vector3(1, 1, -2));
const b2 = new BasicProgram(t2);

const speed = new Vector3(5, 8, 12);
new Renderer([b, b2])
    .setUpdate(() => {
        t.rotate(speed.multiply(Renderer.deltaTime));
        t2.rotate(speed.multiply(Renderer.deltaTime));
    })
    .run();

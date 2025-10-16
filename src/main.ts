import "./style.css";
import { Transform } from "./utils/transform.ts";
import Renderer from "./webgl/renderer.ts";
import { BasicProgram } from "./programs/basicProgram.ts";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3.ts";
import { Camera } from "./utils/camera.ts";
import { cube, teapot, toVertexArray } from "./models/models.ts";
import Quaternion from "3d-game-engine-canvas/src/utilities/Quaternion.ts";

const teapotModel = toVertexArray(teapot);
const cubeModel = toVertexArray(cube);

const t = Transform.zero()
    .scale(new Vector3(0.3, 0.3, 0.3))
    .move(new Vector3(0, 2, -2));
const b = new BasicProgram(t, teapotModel);

const t2 = Transform.zero()
    .scale(new Vector3(10, 1, 10))
    .move(new Vector3(0, -1, 0));
const b2 = new BasicProgram(t2, cubeModel);

const speed = new Vector3(0.5, 0.3, 0.2);
new Renderer([b, b2])
    .setUpdate(() => {
        t.rotate(Quaternion.euler(speed.multiply(Renderer.deltaTime)));
    })
    .run();

document.onkeydown = (e) => {
    const amount = 0.1;
    switch (e.key) {
        case "w":
            Camera.camera.move(new Vector3(0, 0, -amount));
            break;
        case "s":
            Camera.camera.move(new Vector3(0, 0, amount));
            break;
        case "a":
            Camera.camera.move(new Vector3(-amount, 0, 0));
            break;
        case "d":
            Camera.camera.move(new Vector3(amount, 0, 0));
            break;
        case "q":
            Camera.camera.move(new Vector3(0, amount, 0));
            break;
        case "e":
            Camera.camera.move(new Vector3(0, -amount, 0));
            break;
    }
};

document.onmousemove = (e) => {
    if (e.buttons !== 1) return;
    const amount = 0.01;
    Camera.camera.rotate(
        new Vector3(-e.movementY * amount, -e.movementX * amount, 0)
    );
};

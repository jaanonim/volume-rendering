import "./style.css";
import Renderer from "./webgl/renderer.ts";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3.ts";
import { Camera } from "./utils/camera.ts";
import { cube, bonsai, fuel } from "./models/models.ts";
import { makeBasicObject, makeRaymarchingObject } from "./utils/creator.ts";
import Color from "3d-game-engine-canvas/src/utilities/math/Color.ts";
import { ColorMaps } from "./models/colorMaps.ts";

const bonsaiObj = makeRaymarchingObject({
    volume: bonsai,
    position: new Vector3(0, 0.1, -2),
    rotation: new Vector3(0.1, Math.PI / 4, 0),
});

const floorObj = makeBasicObject({
    mesh: cube,
    scale: new Vector3(10, 0.1, 10),
    position: new Vector3(0, -1, 0),
    color: new Color(150, 150, 150, 255),
});

const fuelObj = makeRaymarchingObject({
    volume: fuel,
    colorMap: ColorMaps.gray,
    position: new Vector3(-2, 0, -2),
    rotation: new Vector3(0.1, Math.PI / 4, 0),
});

new Renderer([floorObj, bonsaiObj, fuelObj]).setUpdate(() => {}).run();

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
        case " ":
            Camera.camera.move(new Vector3(0, amount, 0));
            break;
        case "Control":
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

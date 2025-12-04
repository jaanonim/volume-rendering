import "./style.css";
import Renderer from "./webgl/renderer.ts";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3.ts";
import { Camera } from "./utils/camera.ts";
import { cube, bonsai, fuel, backpack, skull } from "./models/models.ts";
import { makeBasicObject, makeRaymarchingObject } from "./utils/creator.ts";
import Color from "3d-game-engine-canvas/src/utilities/math/Color.ts";
import { ColorMaps } from "./models/colorMaps.ts";
import { MarchingCubes } from "./utils/marchingCubes.ts";
import { testAll, testVolume1, testVolume2 } from "./models/test.ts";
import { TextureBasedProgram } from "./programs/textureBasedProgram.ts";
import { Transform } from "./utils/transform.ts";
import Quaternion from "3d-game-engine-canvas/src/utilities/Quaternion.ts";

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

const fuelSolidObj = makeBasicObject({
    mesh: new MarchingCubes(fuel).march(230),
    scale: new Vector3(1 / fuel.size.x, 1 / fuel.size.y, 1 / fuel.size.z),
    position: new Vector3(-2, 1, -2),
    rotation: new Vector3(0.1, Math.PI / 4, 0),
    color: new Color(255, 0, 0, 255),
});

const fuelObj = makeRaymarchingObject({
    volume: fuel,
    colorMap: ColorMaps.gray,
    position: new Vector3(-2, 0, -2),
    rotation: new Vector3(0.1, Math.PI / 4, 0),
});

const backpackObj = makeRaymarchingObject({
    volume: backpack,
    colorMap: ColorMaps.viridis,
    position: new Vector3(2, 0, -2),
    rotation: new Vector3(-Math.PI / 2, 0, 0),
    enableMaxValueSampling: true,
});

// const toothObj = makeRaymarchingObject({
//     volume: tooth,
//     colorMap: ColorMaps.hot,
//     position: new Vector3(4, 0, -2),
//     rotation: new Vector3(0.1, Math.PI / 4, 0),
// });

const skullObj = makeRaymarchingObject({
    volume: skull,
    colorMap: ColorMaps.hot,
    position: new Vector3(-4, 0, -2),
    rotation: new Vector3(-Math.PI / 2, 0, Math.PI / 2),
    enableMaxValueSampling: true,
});

// new Renderer([floorObj, bonsaiObj, fuelObj, skullObj, backpackObj]).run();

// new Renderer([floorObj, bonsaiObj]).setUpdate(() => {}).run();

const t = new Transform(
    Vector3.one,
    Quaternion.euler(Vector3.zero),
    new Vector3(0, 0, -2)
);
const tb = new TextureBasedProgram(t, fuel);

new Renderer([floorObj, tb])
    .setUpdate(() => {
        t.rotate(Quaternion.euler(new Vector3(0.02, 0.01, 0)));
    })
    .run();

const test = makeBasicObject({
    mesh: new MarchingCubes(testAll).march(100),
    scale: new Vector3(
        1 / testAll.size.x,
        1 / testAll.size.y,
        1 / testAll.size.z
    ),
    position: new Vector3(0, 0, -2),
    rotation: new Vector3(0, 0, 0),
    color: new Color(0, 255, 0, 255),
});

// new Renderer([test]).run();

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

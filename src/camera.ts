import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import { Camera } from "./utils/camera";

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

document.getElementById("root")!.onmousemove = (e) => {
    if (e.buttons !== 1) return;
    const amount = 0.01;
    Camera.camera.rotate(
        new Vector3(-e.movementY * amount, -e.movementX * amount, 0)
    );
};

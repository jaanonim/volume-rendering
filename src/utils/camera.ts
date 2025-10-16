import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import { Transform } from "./transform";
import Quaternion from "3d-game-engine-canvas/src/utilities/Quaternion";

export class Camera {
    private static _camera: Camera;
    static get camera(): Camera {
        if (!this._camera) {
            Camera._camera = new Camera();
        }
        return Camera._camera;
    }

    public fovy: number = Math.PI / 2;
    public far: number = 100;
    public near: number = 0.001;
    public transform: Transform;
    constructor() {
        this.transform = new Transform(
            new Vector3(1, 1, 1),
            Quaternion.euler(Vector3.zero),
            new Vector3(0, 0, 0)
        );
        Camera._camera = this;
    }

    public move(v: Vector3) {
        this.transform.move(this.transform._rotation.multiply(v));
        return this;
    }

    public rotate(v: Vector3) {
        this.transform.rotate(
            Quaternion.euler(this.transform._rotation.multiply(v))
        );
        return this;
    }

    public get position() {
        return this.transform._position;
    }

    public get rotation() {
        return this.transform._rotation;
    }
    public get inv_position() {
        return this.transform._position.invert();
    }

    public get inv_rotation() {
        return this.transform._rotation.invert();
    }
}

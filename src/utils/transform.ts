import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import Quaternion from "3d-game-engine-canvas/src/utilities/Quaternion";

export class Transform {
    public _scale: Vector3;
    public _rotation: Quaternion;
    public _position: Vector3;

    constructor(scale: Vector3, rotation: Quaternion, position: Vector3) {
        this._scale = scale;
        this._rotation = rotation;
        this._position = position;
    }

    static zero() {
        return new Transform(
            new Vector3(1, 1, 1),
            Quaternion.euler(Vector3.zero),
            new Vector3(0, 0, 0)
        );
    }

    move(v: Vector3) {
        this._position = this._position.add(v);
        return this;
    }

    rotate(v: Quaternion) {
        this._rotation = v.multiply(this._rotation);
        return this;
    }

    scale(v: Vector3) {
        this._scale = this._scale.multiply(v);
        return this;
    }
}

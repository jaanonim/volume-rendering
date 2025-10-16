import { mat4, quat, vec3 } from "gl-matrix";
import { gl } from "../webgl/context";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import { vector3ToVec3 } from "./vec";

export class Transform {
    public _scale: vec3;
    public _rotation: vec3;
    public _position: vec3;

    constructor(scale: Vector3, rotation: Vector3, position: Vector3) {
        this._scale = vector3ToVec3(scale);
        this._rotation = vector3ToVec3(rotation);
        this._position = vector3ToVec3(position);
    }

    static zero() {
        return new Transform(
            new Vector3(1, 1, 1),
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0)
        );
    }

    move(v: Vector3) {
        this._position[0] += v.x;
        this._position[1] += v.y;
        this._position[2] += v.z;
        return this;
    }

    rotate(v: Vector3) {
        this._rotation[0] += v.x;
        this._rotation[1] += v.y;
        this._rotation[2] += v.z;
        return this;
    }

    scale(v: Vector3) {
        this._scale[0] *= v.x;
        this._scale[1] *= v.y;
        this._scale[2] *= v.z;
        return this;
    }
}

export interface Camera {
    fovy: number;
    far: number;
    near: number;
}

const DEFAULT_CAM: Camera = {
    fovy: Math.PI / 2,
    far: 10,
    near: 0.001,
};

export function transform(t: Transform, c: Camera = DEFAULT_CAM): Float32Array {
    const m = mat4.create();
    const q = quat.create();
    quat.fromEuler(q, t._rotation[0], t._rotation[1], t._rotation[2]);
    mat4.fromRotationTranslationScale(m, q, t._position, t._scale);

    const lookAtMatrix = mat4.create();
    const perspectiveMatrix = mat4.create();
    const uniformMatrix = mat4.create();
    const eye = vec3.fromValues(0, 0, 1);
    const center = vec3.fromValues(0, 0, 0);
    const up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(lookAtMatrix, eye, center, up);
    const aspectRatio = gl.canvas.width / gl.canvas.height;
    mat4.perspective(perspectiveMatrix, c.fovy, aspectRatio, c.near, c.far);
    mat4.multiply(uniformMatrix, m, uniformMatrix);
    mat4.multiply(uniformMatrix, lookAtMatrix, uniformMatrix);
    mat4.multiply(uniformMatrix, perspectiveMatrix, uniformMatrix);
    return uniformMatrix as Float32Array;
}

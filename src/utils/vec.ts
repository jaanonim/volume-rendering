import { mat4, quat, vec3 } from "gl-matrix";
import { gl } from "../webgl/context";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import type { Transform } from "./transform";
import { Camera } from "./camera";

export function vector3ToVec3(v: Vector3): vec3 {
    return [v.x, v.y, v.z] as vec3;
}

export function transform(t: Transform): Float32Array {
    const m = mat4.create();
    const q = quat.fromValues(
        t._rotation.x,
        t._rotation.y,
        t._rotation.z,
        t._rotation.w
    );
    mat4.fromRotationTranslationScale(
        m,
        q,
        vector3ToVec3(t._position),
        vector3ToVec3(t._scale)
    );

    const lookAtMatrix = mat4.create();
    const perspectiveMatrix = mat4.create();
    const uniformMatrix = mat4.create();

    const camera = Camera.camera;
    const qc = quat.fromValues(
        camera.inv_rotation.x,
        camera.inv_rotation.y,
        camera.inv_rotation.z,
        camera.inv_rotation.w
    );
    mat4.identity(lookAtMatrix);
    let quatMat = mat4.create();
    mat4.fromQuat(quatMat, qc);
    mat4.multiply(lookAtMatrix, lookAtMatrix, quatMat);
    mat4.translate(
        lookAtMatrix,
        lookAtMatrix,
        vector3ToVec3(camera.inv_position)
    );

    const aspectRatio = gl.canvas.width / gl.canvas.height;
    mat4.perspective(
        perspectiveMatrix,
        camera.fovy,
        aspectRatio,
        camera.near,
        camera.far
    );

    mat4.multiply(uniformMatrix, m, uniformMatrix);
    mat4.multiply(uniformMatrix, lookAtMatrix, uniformMatrix);
    mat4.multiply(uniformMatrix, perspectiveMatrix, uniformMatrix);
    return uniformMatrix as Float32Array;
}

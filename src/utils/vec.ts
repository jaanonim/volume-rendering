import type Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import type { vec3 } from "gl-matrix";

export function vector3ToVec3(v: Vector3): vec3 {
    return [v.x, v.y, v.z] as vec3;
}

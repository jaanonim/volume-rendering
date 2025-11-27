import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import { RaymarchingProgram } from "../programs/raymarchingProgram";
import { Transform } from "./transform";
import Quaternion from "3d-game-engine-canvas/src/utilities/Quaternion";
import { toVertexArray, Volume } from "../models/models";
import { ColorMaps, Texture } from "../models/colorMaps";
import Color from "3d-game-engine-canvas/src/utilities/math/Color";
import { BasicProgram } from "../programs/basicProgram";
import Mesh from "3d-game-engine-canvas/src/utilities/Mesh";

interface makeRaymarchingObjectProps {
    volume: Volume;
    colorMap?: Texture;
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
    enableMaxValueSampling?: boolean;
}

export function makeRaymarchingObject({
    volume,
    colorMap = ColorMaps.hot,
    position = Vector3.zero,
    rotation = Vector3.zero,
    scale = Vector3.one,
    enableMaxValueSampling = false,
}: makeRaymarchingObjectProps): RaymarchingProgram {
    const rm = new RaymarchingProgram(
        Transform.zero()
            .move(position)
            .rotate(Quaternion.euler(rotation))
            .scale(scale),
        volume,
        colorMap,
        enableMaxValueSampling
    );
    return rm;
}

interface makeBasicObjectProps {
    mesh: Mesh;
    color?: Color;
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
}

export function makeBasicObject({
    mesh,
    color = Color.random(),
    position = Vector3.zero,
    rotation = Vector3.zero,
    scale = Vector3.one,
}: makeBasicObjectProps): BasicProgram {
    const b = new BasicProgram(
        Transform.zero()
            .move(position)
            .rotate(Quaternion.euler(rotation))
            .scale(scale),
        toVertexArray(mesh),
        color
    );
    return b;
}

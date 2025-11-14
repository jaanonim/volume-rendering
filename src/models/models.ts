import ObjLoader from "3d-game-engine-canvas/src/tools/ObjLoader.ts";
import cubeSrc from "./cube.obj?raw";
import teapotSrc from "./teapot.obj?raw";
import Mesh from "3d-game-engine-canvas/src/utilities/Mesh";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import fuelUrl from "../assets/fuel_64x64x64_uint8.raw?url";
import backpackUrl from "../assets/backpack_512x512x373_uint16.raw?url";
import bonsaiUrl from "../assets/bonsai_256x256x256_uint8.raw?url";
import skullUrl from "../assets/skull_256x256x256_uint8.raw?url";
import toothUrl from "../assets/tooth_103x94x161_uint8.raw?url";

export const cube = new ObjLoader(cubeSrc).parse();
export const teapot = new ObjLoader(teapotSrc).parse();
export const fuel = {
    size: new Vector3(64, 64, 64),
    data: await importUint8Volume(fuelUrl),
};
export const backpack = {
    size: new Vector3(512, 512, 373),
    data: uint16ToUint8Volume(await importUint16Volume(backpackUrl)),
};
export const bonsai = {
    size: new Vector3(256, 256, 256),
    data: await importUint8Volume(bonsaiUrl),
};
export const skull = {
    size: new Vector3(256, 256, 256),
    data: await importUint8Volume(skullUrl),
};
export const tooth = {
    size: new Vector3(103, 94, 161),
    data: await importUint8Volume(toothUrl),
};

export async function importUint8Volume(url: string): Promise<Uint8Array> {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
}

export async function importUint16Volume(url: string): Promise<Uint16Array> {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new Uint16Array(buf);
}

export function uint16ToUint8Volume(data: Uint16Array): Uint8Array {
    console.log(data);
    const uint8Data = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
        uint8Data[i] = data[i];
    }
    return uint8Data;
}

export function toVertexArray(model: Mesh): Float32Array<ArrayBuffer> {
    const list = model.triangles.flatMap((t) =>
        t.vertices.flatMap((v) => [v.x, v.y, v.z])
    );
    return new Float32Array(list);
}

export type Volume = {
    size: { x: number; y: number; z: number };
    data: Uint8Array;
};

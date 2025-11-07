import ObjLoader from "3d-game-engine-canvas/src/tools/ObjLoader.ts";
import cubeSrc from "./cube.obj?raw";
import teapotSrc from "./teapot.obj?raw";
import Mesh from "3d-game-engine-canvas/src/utilities/Mesh";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import fuelUrl from "../assets/fuel_64x64x64_uint8.raw?url";
import backpackUrl from "../assets/backpack_512x512x373_uint16.raw?url";
import bonsaiUrl from "../assets/bonsai_256x256x256_uint8.raw?url";

export const cube = new ObjLoader(cubeSrc).parse();
export const teapot = new ObjLoader(teapotSrc).parse();
export const fuel = {
    size: new Vector3(64, 64, 64),
    data: await importUint8Volume(fuelUrl),
};
export const backpack = {
    size: new Vector3(512, 512, 373),
    data: await importUint8Volume(backpackUrl),
};
export const bonsai = {
    size: new Vector3(256, 256, 256),
    data: await importUint8Volume(bonsaiUrl),
};

export async function importUint8Volume(url: string): Promise<Uint8Array> {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
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

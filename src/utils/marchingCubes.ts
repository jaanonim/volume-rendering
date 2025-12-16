import Mesh from "3d-game-engine-canvas/src/utilities/Mesh";
import { Volume } from "../models/models";
import Triangle from "3d-game-engine-canvas/src/utilities/Triangle";
import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3";
import { EdgeVertexIndices, TriangleTable } from "./lut";

type CubeValues = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];

const MIN = 0;
const MAX = 255;

export class MarchingCubes {
    constructor(public volume: Volume) {}

    makeTriangles(
        position: Vector3,
        values: CubeValues,
        threshold: number
    ): Array<Triangle> {
        const idx = values
            .map((v) => (v > threshold ? 1 : 0))
            .reduce((p: number, c: 1 | 0, i) => p + (c << i), 0);
        const listOfTrianglesEdges = TriangleTable[idx]
            .slice(0, -1)
            .reduce(
                (p: Array<any>, c: number, i: number) =>
                    (i % 3 ? p[p.length - 1].push(c) : p.push([c])) && p,
                []
            ) as Array<[number, number, number]>;

        return listOfTrianglesEdges.map(
            (t) =>
                new Triangle(
                    t.map((e) =>
                        this.positionFromEdge(e, values, position, threshold)
                    ) as [Vector3, Vector3, Vector3]
                )
        );
    }

    positionFromEdge(
        idx: number,
        values: CubeValues,
        position: Vector3,
        threshold: number
    ): Vector3 {
        const [ia, ib] = EdgeVertexIndices[idx];
        const [a, b] = [ia, ib].map((v) => values[v]);
        const v = (threshold - b) / (a - b);
        const [posA, posB] = [ia, ib].map((i) =>
            position.add(new Vector3(i & 1, (i >> 1) & 1, (i >> 2) & 1))
        );
        // return posA.subtract(posB).divide(2).add(posB);
        return posA.subtract(posB).multiply(v).add(posB);
    }

    convertThreshold(value: number): number {
        return MIN + (MAX - MIN) * value;
    }

    march(threshold: number): Mesh {
        const triangles: Array<Triangle> = [];
        for (let z = -1; z < this.volume.size.z; z++) {
            for (let y = -1; y < this.volume.size.y; y++) {
                for (let x = -1; x < this.volume.size.x; x++) {
                    const values: CubeValues = [
                        this.sampleVolume(x, y, z),
                        this.sampleVolume(x + 1, y, z),
                        this.sampleVolume(x, y + 1, z),
                        this.sampleVolume(x + 1, y + 1, z),
                        this.sampleVolume(x, y, z + 1),
                        this.sampleVolume(x + 1, y, z + 1),
                        this.sampleVolume(x, y + 1, z + 1),
                        this.sampleVolume(x + 1, y + 1, z + 1),
                    ];
                    const t = this.makeTriangles(
                        new Vector3(x, y, z),
                        values,
                        this.convertThreshold(threshold)
                    );
                    triangles.push(...t);
                }
            }
        }
        return new Mesh(triangles);
    }

    sampleVolume(x: number, y: number, z: number): number {
        if (
            x < 0 ||
            y < 0 ||
            z < 0 ||
            x >= this.volume.size.x ||
            y >= this.volume.size.y ||
            z >= this.volume.size.z
        ) {
            return 0;
        }
        const index = x + this.volume.size.x * (y + this.volume.size.y * z);
        return this.volume.data[index];
    }
}

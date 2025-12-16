import Vector3 from "3d-game-engine-canvas/src/utilities/math/Vector3.ts";
import { ColorMaps, Texture } from "./models/colorMaps.ts";
import { cube, Volume } from "./models/models.ts";
import {
    makeBasicObject,
    makeRaymarchingObject,
    makeTextureBasedObject,
} from "./utils/creator.ts";
import { MarchingCubes } from "./utils/marchingCubes.ts";
import Renderer from "./webgl/renderer.ts";
import { ShaderProgram } from "./webgl/shaderProgram.ts";
import Color from "3d-game-engine-canvas/src/utilities/math/Color.ts";

let currentRenderer: Renderer | null = null;

const makeRenderer = async (programs: Array<ShaderProgram>) => {
    if (currentRenderer) {
        currentRenderer.destroy();
    }
    currentRenderer = new Renderer(programs);
    currentRenderer.run();
};

export interface UpdateValues {
    threshold: number;
    numberOfSlices: number;
    model: Volume;
    colorMap: Texture;
}

export const updateRenderer = ({
    threshold,
    numberOfSlices,
    model,
    colorMap,
}: UpdateValues) => {
    const programs: Array<ShaderProgram> = [
        makeBasicObject({
            mesh: cube,
            scale: new Vector3(10, 0.1, 10),
            position: new Vector3(0, -1, 0),
            color: new Color(150, 150, 150, 255),
        }),
    ];
    if (model.size.x * model.size.y * model.size.z < 65 * 64 * 64) {
        programs.push(
            makeBasicObject({
                mesh: new MarchingCubes(model).march(threshold),
                scale: new Vector3(
                    1 / model.size.x,
                    1 / model.size.y,
                    1 / model.size.z
                ),
                position: new Vector3(1.5, -0.5, -1.5),
                rotation: new Vector3(0, Math.PI / 2, 0),
                color: new Color(255, 0, 0, 255),
            })
        );
    }
    programs.push(
        makeRaymarchingObject({
            volume: model,
            colorMap,
            position: new Vector3(-2, 0, -2),
            rotation: new Vector3(-Math.PI / 2, 0, Math.PI / 2),
            enableMaxValueSampling: false,
        })
    );
    programs.push(
        makeTextureBasedObject({
            volume: model,
            colorMap: colorMap,
            position: new Vector3(0, 0, -2),
            rotation: new Vector3(-Math.PI / 2, 0, Math.PI / 2),
            scale: new Vector3(1, 1, 1),
            numberOfSlices,
        })
    );

    makeRenderer(programs);
};

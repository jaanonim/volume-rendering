import { Texture } from "../models/colorMaps";
import { Volume } from "../models/models";
import { gl } from "./context";

export class ShaderProgram {
    program: WebGLProgram;
    attributes: { [key: string]: { location: number; buffer: WebGLBuffer } };
    uniformsLocations: { [key: string]: WebGLUniformLocation | null };
    transparent: boolean = false;
    textures: {
        [key: string]: {
            texture: WebGLTexture | null;
            location: WebGLUniformLocation | null;
            unit: number;
        };
    };

    makeAttribute(name: string, data: Float32Array, usage: GLenum) {
        const location = gl.getAttribLocation(this.program, name);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        this.attributes[name] = {
            location,
            buffer,
        };
    }

    updateAttribute(name: string, data: Float32Array, offset: number = 0) {
        const attribute = this.attributes[name];
        gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
    }

    makeUniform(name: string) {
        this.uniformsLocations[name] = gl.getUniformLocation(
            this.program,
            name
        );
    }
    makeTexture3D(name: string, volume: Volume) {
        this.textures[name] = {
            texture: gl.createTexture(),
            location: gl.getUniformLocation(this.program, name),
            unit: Object.keys(this.textures).length,
        };
        gl.activeTexture(gl.TEXTURE0 + this.textures[name].unit);
        gl.bindTexture(gl.TEXTURE_3D, this.textures[name].texture);
        gl.texImage3D(
            gl.TEXTURE_3D,
            0,
            gl.R8,
            volume.size.x,
            volume.size.y,
            volume.size.z,
            0,
            gl.RED,
            gl.UNSIGNED_BYTE,
            volume.data
        );

        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.uniform1i(this.uniformsLocations[name], this.textures[name].unit);
    }

    makeTexture2D(name: string, t: Texture) {
        this.textures[name] = {
            texture: gl.createTexture(),
            location: gl.getUniformLocation(this.program, name),
            unit: Object.keys(this.textures).length,
        };
        gl.activeTexture(gl.TEXTURE0 + this.textures[name].unit);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[name].texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            t.size.x,
            t.size.y,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            t.data
        );

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.uniform1i(this.uniformsLocations[name], this.textures[name].unit);
    }

    constructor(program: WebGLProgram) {
        this.program = program;
        this.attributes = {};
        this.uniformsLocations = {};
        this.textures = {};
    }

    getDistanceToCamera(): number {
        return NaN;
    }

    init(): void {}

    draw(): void {}
}

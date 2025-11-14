export class ColorMaps {
    static gray: Texture = {
        size: { x: 256, y: 1 },
        data: new Uint8Array(
            Array.from({ length: 256 }, (_, i) => [i, i, i, 255]).flat()
        ),
    };

    static hot: Texture = {
        size: { x: 256, y: 1 },
        data: new Uint8Array(
            Array.from({ length: 256 }, (_, i) => {
                const r = Math.min(255, i * 3);
                const g = Math.min(255, Math.max(0, (i - 85) * 3));
                const b = Math.min(255, Math.max(0, (i - 170) * 3));
                return [r, g, b, 255];
            }).flat()
        ),
    };

    static viridis: Texture = {
        size: { x: 256, y: 1 },
        data: new Uint8Array(
            Array.from({ length: 256 }, (_, i) => {
                const t = i / 255;
                const r = Math.floor(68 + 187 * t);
                const g = Math.floor(1 + 231 * t);
                const b = Math.floor(84 - 82 * t);
                return [r, g, b, 255];
            }).flat()
        ),
    };

    static red: Texture = {
        size: { x: 256, y: 1 },
        data: new Uint8Array(
            Array.from({ length: 256 }, (_) => [255, 0, 0, 255]).flat()
        ),
    };

    static fadeOpacity(t: Texture) {
        t = ColorMaps.clone(t);
        for (let i = 0; i < t.size.x; i++) {
            t.data[i * 4 + 3] = Math.floor((i / (t.size.x - 1)) * 255);
        }
        return t;
    }

    static clampOpacity(t: Texture, minAlpha: number, maxAlpha: number) {
        t = ColorMaps.clone(t);
        for (let i = 0; i < t.size.x; i++) {
            t.data[i * 4 + 3] =
                i > minAlpha && i < maxAlpha ? t.data[i * 4 + 3] : 0;
        }
        return t;
    }

    static clone(t: Texture): Texture {
        return {
            size: { x: t.size.x, y: t.size.y },
            data: new Uint8Array(t.data),
        };
    }
}

export type Texture = {
    size: { x: number; y: number };
    data: Uint8Array;
};

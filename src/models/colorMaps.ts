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

    static red: Texture = {
        size: { x: 256, y: 1 },
        data: new Uint8Array(
            Array.from({ length: 256 }, (_) => [255, 0, 0, 255]).flat()
        ),
    };
}

export type Texture = {
    size: { x: number; y: number };
    data: Uint8Array;
};

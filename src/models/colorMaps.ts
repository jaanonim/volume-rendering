export class ColorMaps {
    static gray: Texture = {
        size: { x: 256, y: 1 },
        data: new Uint8Array(
            Array.from({ length: 256 }, (_, i) => [i, i, i]).flat()
        ),
    };

    static hot: Texture = {
        size: { x: 256, y: 1 },
        data: new Uint8Array(
            Array.from({ length: 256 }, (_, i) => {
                const r = Math.min(255, i * 3);
                const g = Math.min(255, Math.max(0, (i - 85) * 3));
                const b = Math.min(255, Math.max(0, (i - 170) * 3));
                return [r, g, b];
            }).flat()
        ),
    };
}

export type Texture = {
    size: { x: number; y: number };
    data: Uint8Array;
};

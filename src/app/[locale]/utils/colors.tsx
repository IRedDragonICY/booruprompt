export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

export const getContrastColor = (r: number, g: number, b: number): string => {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 128 ? '0 0 0' : '255 255 255';
};

export const adjustRgb = (r: number, g: number, b: number, factor: number): string => {
    const adjust = (color: number) => Math.max(0, Math.min(255, Math.round(color * factor)));
    return `${adjust(r)} ${adjust(g)} ${adjust(b)}`;
};
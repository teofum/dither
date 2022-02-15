import Palette from './Palette';
import PaletteType from './PaletteType';

const getMixerColor = (palette: Palette, index: number): number[] => {
  const header = palette.data.slice(0, 4);
  const sub = header[1] === 1;
  const inputCount = (palette.data.length - 4) / 5;
  const value: number[] = sub ? [255, 255, 255] : [0, 0, 0];

  // Extract different properties from data
  const levels = (i: number) => palette.data[4 + i * 5];
  const minValue = (i: number) => palette.data[5 + i * 5];
  const color = (i: number) => palette.data.slice(6 + i * 5, 9 + i * 5);
  const step = (i: number) => {
    let step = index;
    for (let j = 0; j < i; j++) step = ~~(step / levels(j));
    return step % levels(i);
  };

  // For each color add to value
  for (let i = 0; i < inputCount; i++) {
    // Get max value, calculate min value, step, and value component
    color(i).forEach((vMax, j) => {
      if (sub) vMax = 255 - vMax;
      const vMin = ~~(vMax * minValue(i));
      const vRange = vMax - vMin;
      const vChannel = vMin + step(i) * ~~(vRange / (levels(i) - 1));
      value[j] += sub ? (-vChannel) : vChannel;
      if (value[j] < 0) value[j] = 0;
      if (value[j] > 255) value[j] = 255;
    });
  }
  return value;
};

export const getPaletteSize = (palette: Palette): number => {
  switch (palette.type) {
    case PaletteType.Indexed:
      return palette.data.length / 3;
    case PaletteType.Mono:
      return palette.data[0];
    case PaletteType.RGB:
      return palette.data[0] * palette.data[1] * palette.data[2];
    case PaletteType.Mixer: {
      const inputCount = (palette.data.length - 4) / 5;
      let colors = 1;
      for (let i = 0; i < inputCount; i++)
        colors *= palette.data[4 + i * 5];
      return colors;
    }
    case PaletteType.Auto:
      return palette.data[0];
    default:
      return 0;
  }
};

export const getPaletteColor = (palette: Palette, i: number): number[] => {
  if (i < 0 || i >= getPaletteSize(palette)) throw new Error(`Color index ${i} out of bounds`);

  switch (palette.type) {
    case PaletteType.Indexed:
      return palette.data.slice(i * 3, i * 3 + 3);
    case PaletteType.Mono:
      return palette.data.slice(2, 5).map(vMax => {
        const vMin = ~~(vMax * palette.data[1]);
        const vRange = vMax - vMin;
        return vMin + i * ~~(vRange / (palette.data[0] - 1));
      });
    case PaletteType.Mixer: {
      return getMixerColor(palette, i);
    }
    case PaletteType.RGB: {
      const b = i % palette.data[2];
      const g = ~~(i / palette.data[2]) % palette.data[1];
      const r = ~~(i / (palette.data[2] * palette.data[1]));

      return [r, g, b].map((level, i) => level * ~~(255 / (palette.data[i] - 1)));
    }
    case PaletteType.Auto:
    default:
      throw new Error('Invalid or Auto palette type');
  }
};

const getPaletteColors = (palette: Palette): number[][] => {
  return Array.from(
    { length: getPaletteSize(palette) },
    (_, i) => getPaletteColor(palette, i)
  );
};

export default getPaletteColors;
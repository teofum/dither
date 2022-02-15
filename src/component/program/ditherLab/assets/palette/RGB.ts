import Palette from '../../utils/Palette';
import PaletteGroup from '../../utils/PaletteGroup';
import PaletteType from '../../utils/PaletteType';

export const RGB8: Palette = {
  name: '8-color RGB (3-bit, 1bpc)',
  type: PaletteType.RGB,
  group: PaletteGroup.RGB,
  data: [2, 2, 2]
};

export const RGB16: Palette = {
  name: '16-color RGB (4-bit, 1-2-1)',
  type: PaletteType.RGB,
  group: PaletteGroup.RGB,
  data: [2, 4, 2]
};

export const RGB32: Palette = {
  name: '32-color RGB (5-bit, 2-2-1)',
  type: PaletteType.RGB,
  group: PaletteGroup.RGB,
  data: [4, 4, 2]
};

export const RGB64: Palette = {
  name: '64-color RGB (6-bit, 2bpc)',
  type: PaletteType.RGB,
  group: PaletteGroup.RGB,
  data: [4, 4, 4]
};

export const RGB256: Palette = {
  name: '256-color RGB (8-bit, 3-3-2)',
  type: PaletteType.RGB,
  group: PaletteGroup.RGB,
  data: [8, 8, 4]
};

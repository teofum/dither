import Palette from '../../utils/ditherLab/Palette';
import PaletteGroup from '../../utils/ditherLab/PaletteGroup';
import PaletteType from '../../utils/ditherLab/PaletteType';

export const Mono2W: Palette = {
  name: 'Black/White (1-bit MC)',
  type: PaletteType.Mono,
  group: PaletteGroup.Mono,
  data: [2, 0, 255, 255, 255]
};

export const Mono2G: Palette = {
  name: 'Black/Green (1-bit MC)',
  type: PaletteType.Mono,
  group: PaletteGroup.Mono,
  data: [2, 0, 0, 255, 0]
};

export const Mono2A: Palette = {
  name: 'Black/Amber (1-bit MC)',
  type: PaletteType.Mono,
  group: PaletteGroup.Mono,
  data: [2, 0, 255, 200, 15]
};

export const Mono4W: Palette = {
  name: '4-tone Greyscale (2-bit MC)',
  type: PaletteType.Mono,
  group: PaletteGroup.Mono,
  data: [4, 0, 255, 255, 255]
};

export const Mono4A: Palette = {
  name: '4-tone Amber (2-bit MC)',
  type: PaletteType.Mono,
  group: PaletteGroup.Mono,
  data: [4, 0.04, 255, 200, 15]
};

export const Mono16: Palette = {
  name: '16-tone Greyscale (4-bit MC)',
  type: PaletteType.Mono,
  group: PaletteGroup.Mono,
  data: [16, 0, 255, 255, 255]
};

export const PipBoy: Palette = {
  name: 'Pip-Boy 3000 (2-bit MC)',
  type: PaletteType.Mono,
  group: PaletteGroup.Mono,
  data: [4, 0.15, 64, 252, 155]
};


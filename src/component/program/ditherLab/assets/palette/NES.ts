import Palette from '../../utils/Palette';
import PaletteGroup from '../../utils/PaletteGroup';
import PaletteType from '../../utils/PaletteType';

const NES56: Palette = {
  name: 'NES (All colors) (*)',
  type: PaletteType.Indexed,
  group: PaletteGroup.RetroVC,
  data: [
    0x00, 0x00, 0x00,
    0x28, 0x28, 0x28,
    0xA8, 0xA8, 0xA8,

    0x00, 0x18, 0x20,
    0x00, 0x60, 0x70,
    0x00, 0xC0, 0xD0,
    0x90, 0xE0, 0xE8,

    0x00, 0x1E, 0x00,
    0x00, 0x68, 0x10,
    0x00, 0xC8, 0x70,
    0x90, 0xE8, 0xC8,

    0x00, 0x68, 0x00,
    0x28, 0xC0, 0x20,
    0xA8, 0xE8, 0xA0,

    0x00, 0x18, 0x00,
    0x08, 0x58, 0x00,
    0x70, 0xB0, 0x00,
    0xC8, 0xE0, 0x90,

    0x10, 0x00, 0x00,
    0x60, 0x40, 0x00,
    0xC0, 0x98, 0x00,
    0xE8, 0xD8, 0x88,

    0x40, 0x00, 0x00,
    0xA0, 0x20, 0x00,
    0xF8, 0x80, 0x18,
    0xF8, 0xC8, 0xA0,

    0x58, 0x00, 0x00,
    0xD0, 0x10, 0x00,
    0xF8, 0x70, 0x68,
    0xF8, 0xC0, 0xC0,

    0x58, 0x00, 0x10,
    0xD0, 0x00, 0x58,
    0xF8, 0x70, 0xB0,
    0xF8, 0xC0, 0xE0,

    0x38, 0x00, 0x50,
    0xA0, 0x08, 0xA8,
    0xF8, 0x68, 0xF8,
    0xF8, 0xC0, 0xF8,

    0x00, 0x08, 0x70,
    0x58, 0x18, 0xD8,
    0x98, 0x68, 0xF8,
    0xD0, 0xB8, 0xF8,

    0x00, 0x08, 0x78,
    0x08, 0x30, 0xE0,
    0x50, 0x78, 0xF8,
    0xB0, 0xC0, 0xF8,

    0x00, 0x08, 0x58,
    0x00, 0x48, 0xB8,
    0x20, 0xA0, 0xF8,
    0xA8, 0xD8, 0xF8,

    0x48, 0x48, 0x48,
    0xA0, 0xA0, 0xA0,
    0xF8, 0xF8, 0xF8 
  ]
};

export default NES56;
import Palette from '../../utils/ditherLab/Palette';
import PaletteGroup from '../../utils/ditherLab/PaletteGroup';
import PaletteType from '../../utils/ditherLab/PaletteType';

export const GameBoy: Palette = {
  name: 'Game Boy (2-bit MC)',
  type: PaletteType.Indexed,
  group: PaletteGroup.RetroVC,
  data: [
    0x0F, 0x38, 0x0F,
    0x30, 0x62, 0x30,
    0x8B, 0xAC, 0x0F,
    0x9B, 0xBC, 0x0F 
  ]
};
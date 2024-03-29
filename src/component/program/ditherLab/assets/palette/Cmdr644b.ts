import Palette from '../../utils/Palette';
import PaletteGroup from '../../utils/PaletteGroup';
import PaletteType from '../../utils/PaletteType';

const Cmdr644b: Palette = {
  name: 'Commodore 64 (*)',
  type: PaletteType.Indexed,
  group: PaletteGroup.RetroPC,
  data: [
    0x00, 0x00, 0x00, // Black
    0x62, 0x62, 0x52, // Dark Gray
    0x89, 0x89, 0x89, // Mid Gray
    0xAD, 0xAD, 0xAD, // Light Gray
    0xFF, 0xFF, 0xFF, // White
    0x9F, 0x4E, 0x44, // Red
    0xCB, 0x7E, 0x75, // Light Red
    0x6D, 0x54, 0x12, // Brown
    0xA1, 0x68, 0x3C, // Orange
    0xC9, 0xD4, 0x87, // Yellow
    0x9A, 0xE2, 0x9B, // Light Green
    0x5C, 0xAB, 0x5E, // Green
    0x6A, 0xBF, 0xC6, // Cyan
    0x88, 0x7E, 0xCB, // Light Blue
    0x50, 0x45, 0x9B, // Blue
    0xA0, 0x57, 0xA3  // Purple
  ]
};

export default Cmdr644b;
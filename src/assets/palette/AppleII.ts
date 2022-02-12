import Palette from '../../utils/ditherLab/Palette';
import PaletteGroup from '../../utils/ditherLab/PaletteGroup';
import PaletteType from '../../utils/ditherLab/PaletteType';

export const AppleII4b: Palette = {
  name: 'Apple II (16-color) (*)',
  type: PaletteType.Indexed,
  group: PaletteGroup.RetroPC,
  data: [
    0, 0, 0,        // Black
    156, 156, 156,  // Gray (repeated twice)
    255, 255, 255,  // White
    96, 78, 189,    // Dark blue
    208, 195, 255,  // Light blue
    255, 68, 253,   // Purple
    227, 30, 96,    // Red
    255, 160, 208,  // Pink
    255, 106, 60,   // Orange
    96, 114, 3,     // Brown
    208, 221, 141,  // Yellow
    20, 245, 60,    // Green
    0, 163, 96,     // Dark green
    114, 255, 208,  // Aqua
    20, 207, 253    // Med Blue
  ]
};

export const AppleIIHR: Palette = {
  name: 'Apple II High-res (6-color) (*)',
  type: PaletteType.Indexed,
  group: PaletteGroup.RetroPC,
  data: [
    0, 0, 0,        // Black
    255, 255, 255,  // White
    255, 68, 253,   // Purple
    255, 106, 60,   // Orange
    20, 245, 60,    // Green
    20, 207, 253    // Blue
  ]
};

export const AppleIIGS: Palette = {
  name: 'Apple IIGS (MCV)',
  type: PaletteType.Indexed,
  group: PaletteGroup.RetroPC,
  data: [
    0, 0, 0,        // Black
    221, 0, 51,     // Deep Red
    0, 0, 153,      // Dark Blue
    221, 34, 221,   // Purple
    0, 119, 34,     // Dark Green
    85, 85, 85,     // Dark Gray
    34, 34, 255,    // Med Blue
    102, 170, 255,  // Light Blue
    136, 85, 0,     // Brown
    255, 102, 0,    // Orange
    170, 170, 170,  // Light Gray
    255, 153, 136,  // Pink
    17, 221, 0,     // Light Green
    255, 255, 0,    // Yellow
    68, 255, 153,   // Aquamarine
    255, 255, 255   // White
  ]
};

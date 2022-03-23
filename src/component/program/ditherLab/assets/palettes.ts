import Win4bRGBI from './palette/Win4bRGBI';
import Cmdr644b from './palette/Cmdr644b';
import { AppleII4b, AppleIIHR, AppleIIGS } from './palette/AppleII';
import Macintosh4b from './palette/Macintosh4b';
import NicePalette from './palette/NicePalette';
import CGA4bRGBI from './palette/CGA4bRGBI';
import { CGAm4p0h, CGAm4p0l, CGAm4p1h, CGAm4p1l, CGAm5h, CGAm5l } from './palette/CGA2bModes';
import { GameBoy } from './palette/Gameboy';
import NES56 from './palette/NES';
import { RGB16, RGB216, RGB256, RGB32, RGB64, RGB8 } from './palette/RGB';
import { Mono2W, Mono2G, Mono2A, Mono4W, Mono4A, Mono16, PipBoy } from './palette/Mono';

const palettes = [
  // CGA 4-color
  CGAm4p0h,
  CGAm4p0l,
  CGAm4p1h,
  CGAm4p1l,
  CGAm5h,
  CGAm5l,

  // Retro PC
  Win4bRGBI,
  CGA4bRGBI,
  Cmdr644b,
  AppleII4b,
  AppleIIHR,
  AppleIIGS,
  Macintosh4b,

  // Retro consoles
  GameBoy,
  NES56,

  // RGB
  RGB8,
  RGB16,
  RGB32,
  RGB64,
  RGB256,
  RGB216,

  // Mono
  Mono2W,
  Mono2A,
  Mono2G,
  Mono4W,
  Mono4A,
  Mono16,

  // Other
  NicePalette,
  PipBoy
];

export default palettes;
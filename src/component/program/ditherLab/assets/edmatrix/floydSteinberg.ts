import { ErrorDiffusionMatrix } from '../asyncProcess/ErrorDiffusion';

const floydSteinberg: ErrorDiffusionMatrix = [
  { x:  1, y: 0, w: 7 / 16 },
  { x: -1, y: 1, w: 3 / 16 },
  { x:  0, y: 1, w: 5 / 16 },
  { x:  1, y: 1, w: 1 / 16 }
];

export default floydSteinberg;
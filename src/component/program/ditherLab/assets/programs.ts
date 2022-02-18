import bayerLike from './programs/BayerLike';
import errorDiffusion from './programs/ErrorDiffusion';
import patternDither from './programs/PatternDither';
import patternDitherCPU from './programs/PatternDitherCPU';

const programs = [
  // WebGL
  patternDither,
  bayerLike,

  // Software
  errorDiffusion,
  patternDitherCPU
];

export default programs;
import bayerLike from './programs/BayerLike';
import errorDiffusion from './programs/ErrorDiffusion';
import patternDither from './programs/PatternDither';

const programs = [
  // WebGL
  patternDither,
  bayerLike,

  // Software
  errorDiffusion
];

export default programs;
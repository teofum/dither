import imageVert from './shader/image.vert.glsl?raw';
import imageFrag from './shader/image.frag.glsl?raw';
import patternFrag from './shader/pattern.frag.glsl?raw';
import bayerFrag from './shader/bayer.frag.glsl?raw';

const shaders = {
  imageVert,
  imageFrag,
  patternFrag,
  bayerFrag
};

export default shaders;
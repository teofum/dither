/** 
  Create and link a WebGL program
  @param gl the WebGL rendering context
  @param vert vertex shader
  @param frag fragment shader
*/
const linkProgram = (
  gl: WebGLRenderingContext,
  vert: WebGLShader,
  frag: WebGLShader
): WebGLProgram => {
  const program = gl.createProgram();
  if (!program) throw new Error('linkProgram: gl.createProgram failed');

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  const info = gl.getProgramInfoLog(program);
  gl.deleteProgram(program);
  throw new Error(`linkProgram: link error: ${info}`);
};

export default linkProgram;

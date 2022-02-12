/** 
  Create and compile a WebGL shader from source
  @param gl the WebGL rendering context
  @param type shader type, usually gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
  @param source the shader source in GLSL
*/
const createShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('createShader: gl.createShader failed');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  const info = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error(`createShader: compile error: ${info}`);
};

export default createShader;

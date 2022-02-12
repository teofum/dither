/** 
* Resize WebGL viewport to canvas resolution
*/
const autosizeViewport = (gl: WebGLRenderingContext): void =>
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

export default autosizeViewport;
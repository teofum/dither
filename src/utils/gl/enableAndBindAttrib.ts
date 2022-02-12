/** 
  Attribute binding options
*/
export interface AttribBindOptions {
  /** Components per iteration */
  size: number;
  
  /** Data type, for example gl.FLOAT */
  type: number;
  
  /** Normalize data, default false */
  normalize?: boolean;
  
  /** Amount to move forward each iteration, default 0 = size * sizeof(type) */
  stride?: number;
  
  /** Start offset, default 0 */
  offset?: number;
}

/** 
  Enable an attribute and bind to a buffer
  @param gl the WebGL rendering context
  @param attribLocation attribute location, optained with gl.getAttribLocation
  @param sourceBuffer source buffer to bind the attribute to
  @param options binding options
*/
const enableAndBindAttrib = (
  gl: WebGLRenderingContext,
  attribLocation: number,
  sourceBuffer: WebGLBuffer | null,
  options: AttribBindOptions
) => {
  // Enable attrbiute
  gl.enableVertexAttribArray(attribLocation);

  // Bind positionBuffer to 'a_position'
  gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer);

  // gl.vertexAttribPointer binds the current ARRAY_BUFFER to the attribute
  gl.vertexAttribPointer(
    attribLocation,
    options.size,
    options.type,
    options.normalize || false,
    options.stride || 0,
    options.offset || 0);
};

export default enableAndBindAttrib;
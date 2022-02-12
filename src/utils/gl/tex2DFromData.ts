const tex2DFromData = (
  gl: WebGLRenderingContext,
  data: number[],
  texUnitIndex: number
): WebGLTexture => {
  // Create a texture
  const texture = gl.createTexture();
  if (!texture) throw new Error('tex2DFromData: failed to create texture');

  gl.activeTexture(texUnitIndex);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // TODO options
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Create the texture from data.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.LUMINANCE,
    8,
    8,
    0,
    gl.LUMINANCE,
    gl.UNSIGNED_BYTE,
    new Uint8Array(data));

  return texture;
};

export default tex2DFromData;
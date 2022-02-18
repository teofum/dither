const tex2DFromImage = (
  gl: WebGLRenderingContext,
  image: HTMLImageElement,
  options: {
    internalFormat: number,
    format: number,
    type: number
  } = {
      internalFormat: gl.RGBA,
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE
    },
  texUnitIndex: number = gl.TEXTURE0
): WebGLTexture => {
  // Create a texture
  const texture = gl.createTexture();
  if (!texture) throw new Error('tex2DFromImage: failed to create texture');

  gl.activeTexture(texUnitIndex);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // TODO options
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload the image into the texture.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    options.internalFormat,
    options.format,
    options.type,
    image);

  return texture;
};

export default tex2DFromImage;
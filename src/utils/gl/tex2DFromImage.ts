const tex2DFromImage = (
  gl: WebGLRenderingContext,
  image: HTMLImageElement,
  texUnitIndex: number
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
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return texture;
};

export default tex2DFromImage;
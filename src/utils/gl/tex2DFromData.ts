const tex2DFromData = (
  gl: WebGLRenderingContext,
  width: number,
  height: number,
  data: number[],
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
  if (!texture) throw new Error('tex2DFromData: failed to create texture');

  gl.activeTexture(texUnitIndex);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // TODO options
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  let dataArray: ArrayBufferView | null = null;
  switch (options.type) {
    case gl.UNSIGNED_BYTE:
      dataArray = new Uint8Array(data);
      break;
    case gl.UNSIGNED_SHORT:
    case gl.UNSIGNED_SHORT_5_6_5:
    case gl.UNSIGNED_SHORT_5_5_5_1:
    case gl.UNSIGNED_SHORT_4_4_4_4:
      dataArray = new Uint16Array(data);
      break;
    case gl.UNSIGNED_INT:
      dataArray = new Uint32Array(data);
      break;
    case gl.FLOAT:
      dataArray = new Float32Array(data);
      break;
  }

  // Create the texture from data.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    options.internalFormat,
    width,
    height,
    0,
    options.format,
    options.type,
    dataArray);

  return texture;
};

export default tex2DFromData;
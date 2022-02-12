import shaders from '../../../../assets/shaders';
import getPaletteColors from '../../../../utils/ditherLab/getColors';
import autosizeViewport from '../../../../utils/gl/autosizeViewport';
import createShader from '../../../../utils/gl/createShader';
import enableAndBindAttrib from '../../../../utils/gl/enableAndBindAttrib';
import linkProgram from '../../../../utils/gl/linkProgram';
import tex2DFromData from '../../../../utils/gl/tex2DFromData';
import tex2DFromImage from '../../../../utils/gl/tex2DFromImage';
import { DitherLabOptions } from '../DitherLab.state';
import DitherLabProgram, { DitherLabDevice, DitherLabProgramSettingType } from '../DitherLabProgram';

const positions = [
  -1, 1,
  -1, -1,
  1, 1,
  -1, -1,
  1, -1,
  1, 1
];

const texCoords = [
  0.0, 0.0,
  0.0, 1.0,
  1.0, 0.0,
  0.0, 1.0,
  1.0, 1.0,
  1.0, 0.0
];

const def = (ev?: number, def?: number) => {
  return ev !== undefined ? ev : def;
};

let programCache: WebGLProgram | null = null;
let lastContext: WebGLRenderingContext | null = null;
let lastOptions: DitherLabOptions | null = null;
// let lastSettings: { [key: string]: number } | null = null;

const runBayerLike = async (
  rt: HTMLCanvasElement,
  options: DitherLabOptions
) => {
  if (!options.image.element)
    throw new Error('runBayerLike: Image is null');
  if (!options.palette.palette)
    throw new Error('runBayerLike: No palette selected');

  const gl = rt.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) throw new Error('runBayerLike: WebGL is unavailable');

  const settings = options.process.settingValues;
  const palette = getPaletteColors(options.palette.palette)
    .flat()
    .map(n => n / 255);

  autosizeViewport(gl);

  // Invalidate cache
  if (options.palette.palette !== lastOptions?.palette.palette  // New palette requires shader recompile
    || gl !== lastContext) // Context changed
    programCache = null;
  lastOptions = options;
  lastContext = gl;
  // lastSettings = settings;

  // Use cached program if possible
  let program = programCache;
  if (!program) {
    console.log('Compiling shaders...');

    const fragSource = shaders.bayerFrag
      .replace(/\$/g, (~~(palette.length / 3)).toString()); // Replace '$' symbol in source with palette size

    const vert = createShader(gl, gl.VERTEX_SHADER, shaders.imageVert);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    program = linkProgram(gl, vert, frag);
    programCache = program;
  }

  // Get attribute locations
  const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

  // Get uniform locations
  const paletteUniformLocation = gl.getUniformLocation(program, 'u_palette');
  const texSizeUniformLocation = gl.getUniformLocation(program, 'u_texSize');
  const imageUniformLocation = gl.getUniformLocation(program, 'u_image');
  const thresholdUniformLocation = gl.getUniformLocation(program, 'u_threshold');
  const gammaUniformLocation = gl.getUniformLocation(program, 'u_gamma');

  // Populate positions buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Populate texCoord buffer
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  // Load image to texture 0
  tex2DFromImage(gl, options.image.element, gl.TEXTURE0);

  const thresholdData = [
    0, 48, 12, 60, 3, 51, 15, 63,
    32, 16, 44, 28, 35, 19, 47, 31,
    8, 56, 4, 52, 11, 59, 7, 55,
    40, 24, 36, 20, 43, 27, 39, 23,
    2, 50, 14, 62, 1, 49, 13, 61,
    34, 18, 46, 30, 33, 17, 45, 29,
    10, 58, 6, 54, 9, 57, 5, 53,
    42, 26, 38, 22, 41, 25, 37, 21
  ].map(n => n * 4);
  tex2DFromData(gl, thresholdData, gl.TEXTURE1);

  // Clear framebuffer
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set program
  gl.useProgram(program);

  // Set uniforms
  gl.uniform3fv(paletteUniformLocation, palette);
  gl.uniform2f(texSizeUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform1i(imageUniformLocation, 0);
  gl.uniform1i(thresholdUniformLocation, 1);
  gl.uniform1f(gammaUniformLocation,
    def(settings.gamma, bayerLike.settings.gamma.default) || 0);

  // Bind attributes
  enableAndBindAttrib(gl, positionAttribLocation, positionBuffer, {
    size: 2,
    type: gl.FLOAT
  });
  enableAndBindAttrib(gl, texCoordLocation, texCoordBuffer, {
    size: 2,
    type: gl.FLOAT
  });

  // Execute program
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

const bayerLike: DitherLabProgram = {
  device: DitherLabDevice.GL,
  name: 'Color Pair Matrix',
  settings: {
    gamma: {
      name: 'Gamma',
      type: DitherLabProgramSettingType.Range,
      min: 1,
      max: 8,
      step: 0.2,
      default: 2.2,
      showValue: val => val.toFixed(1)
    }
  },
  run: runBayerLike
};

export default bayerLike;
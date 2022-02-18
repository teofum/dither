import shaders from '../shaders';
import getPaletteColors from '../../utils/getColors';
import autosizeViewport from '../../../../../utils/gl/autosizeViewport';
import createShader from '../../../../../utils/gl/createShader';
import enableAndBindAttrib from '../../../../../utils/gl/enableAndBindAttrib';
import linkProgram from '../../../../../utils/gl/linkProgram';
import tex2DFromData from '../../../../../utils/gl/tex2DFromData';
import tex2DFromImage from '../../../../../utils/gl/tex2DFromImage';
import { DitherLabOptions } from '../../DitherLab.state';
import DitherLabProgram, { DitherLabDevice, DitherLabProgramSettingType } from '../../utils/DitherLabProgram';
import thresholds from '../thresholds';

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
let lastPaletteSize: number | null = null;
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

  const paletteSize = ~~(palette.length / 3);

  // Invalidate cache
  if (paletteSize !== lastPaletteSize                     // New palette requires shader recompile
    || gl !== lastContext)                                // Context changed
    programCache = null;
  lastPaletteSize = paletteSize;
  lastContext = gl;
  // lastSettings = settings;

  // Use cached program if possible
  let program = programCache;
  if (!program) {
    console.log('Compiling shaders...');

    const fragSource = shaders.bayerFrag
      .replace(/\$/g, paletteSize.toString()); // Replace '$' symbol in source with palette size

    const vert = createShader(gl, gl.VERTEX_SHADER, shaders.imageVert);
    const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSource);

    program = linkProgram(gl, vert, frag);
    programCache = program;
  }

  // Get attribute locations
  const a_position = gl.getAttribLocation(program, 'a_position');
  const a_texCoord = gl.getAttribLocation(program, 'a_texCoord');

  // Get uniform locations
  const u_palette = gl.getUniformLocation(program, 'u_palette');
  const u_texSize = gl.getUniformLocation(program, 'u_texSize');
  const u_image = gl.getUniformLocation(program, 'u_image');
  const u_threshold = gl.getUniformLocation(program, 'u_threshold');
  const u_thres_size = gl.getUniformLocation(program, 'u_thres_size');
  const u_gamma = gl.getUniformLocation(program, 'u_gamma');

  // Populate positions buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Populate texCoord buffer
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  const threshold = thresholds[settings.threshold || 0];

  // Load image to texture 0 and threshold matrix to texture 1
  tex2DFromImage(gl, options.image.element);
  tex2DFromData(
    gl,
    threshold.size,
    threshold.size,
    threshold.data,
    {
      format: gl.LUMINANCE,
      internalFormat: gl.LUMINANCE,
      type: gl.UNSIGNED_BYTE
    },
    gl.TEXTURE1);

  // Clear framebuffer
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set program
  gl.useProgram(program);

  // Set uniforms
  gl.uniform3fv(u_palette, palette);
  gl.uniform2f(u_texSize, gl.canvas.width, gl.canvas.height);
  gl.uniform1i(u_image, 0);
  gl.uniform1i(u_threshold, 1);
  gl.uniform1f(u_thres_size, threshold.size);
  gl.uniform1f(u_gamma,
    def(settings.gamma, bayerLike.settings.gamma.default) || 0);

  // Bind attributes
  enableAndBindAttrib(gl, a_position, positionBuffer, {
    size: 2,
    type: gl.FLOAT
  });
  enableAndBindAttrib(gl, a_texCoord, texCoordBuffer, {
    size: 2,
    type: gl.FLOAT
  });

  // Execute program
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

const bayerLike: DitherLabProgram = {
  device: DitherLabDevice.GL,
  name: 'Color Pair Ordered',
  settings: {
    threshold: {
      name: 'Matrix',
      type: DitherLabProgramSettingType.Combo,
      options: [
        { name: '8x8 Bayer Matrix', value: 0 },
        { name: '4x4 Bayer Matrix', value: 1 },
        { name: '64x64 Blue Noise', value: 2 },
        { name: '16x16 Blue Noise', value: 3 }
      ]
    },
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
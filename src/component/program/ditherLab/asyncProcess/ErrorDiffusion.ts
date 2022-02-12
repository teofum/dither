import edMatrices from '../../../../assets/edmatrices';
import { linear2srgb, srgb2linear } from '../../../../utils/ditherLab/colorUtils';
import getPaletteColors from '../../../../utils/ditherLab/getColors';
import { paletteMap } from '../../../../utils/ditherLab/paletteMap';
import { AsyncProcess } from '../asyncProcess';
import { DitherLabOptions } from '../DitherLab.state';
import { ProgressFn } from '../ProcessWorker';

const vec3distance = (a: number[], b: number[]): number => {
  return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]);
};

export type ErrorDiffusionMatrix = { x: number, y: number, w: number }[];

function processErrorDiffusion(
  dataIn: ImageData,
  options: DitherLabOptions,
  settings: { [key: string]: number },
  cbProgress: ProgressFn | null
): ImageData {
  const size = dataIn.width * dataIn.height * 4;
  const line = dataIn.width * 4;
  const matrix = edMatrices[settings.matrix || 0];

  if (!options.palette.palette)
    throw new Error('null palette');
  const colors = getPaletteColors(options.palette.palette);
  const gamma = settings.gamma || 2.2;

  for (let i = 0; i < size; i += 4) {
    const linear = srgb2linear(Array.from(dataIn.data.slice(i, i + 3)), gamma);
    for (let j = 0; j < 3; j++) dataIn.data[i + j] = linear[j];

    if (i % (line * 4) === 0 && cbProgress) cbProgress(i, size, dataIn);
  }

  for (let i = 0; i < colors.length; i++)
    colors[i] = srgb2linear(colors[i], gamma);

  for (let i = 0; i < size; i += 4) {
    const color = Array.from(dataIn.data.slice(i, i + 3));
    const mapped: readonly number[] = paletteMap(color, colors, vec3distance);
    const x = (i % line) / 4;

    for (let j = 0; j < 3; j++)
      dataIn.data[i + j] = linear2srgb(mapped, gamma)[j];

    const error = color.map((ch, i) => ch - mapped[i]);
    for (let k = 0; k < matrix.length; k++) {
      const index = i + matrix[k].x * 4 + matrix[k].y * line;

      // Bounds check, fixes small error at the edges
      if (x + matrix[k].x >= 0 && x + matrix[k].x < dataIn.width) {
        for (let j = 0; j < 3; j++)
          dataIn.data[index + j] += error[j] * matrix[k].w;
      }
    }

    if (i % (4 * line) === 0 && cbProgress) cbProgress(i, size, dataIn);
  }

  return dataIn;
}

const ErrorDiffusion: AsyncProcess = {
  id: 'ProcErrorDiffusion',
  name: 'Error Diffusion',
  run: processErrorDiffusion,

  maxAllowedPaletteSize: 65536,
  supports: {
    threads: false, // Unsupported
    gamma: true
  },
  complexity: (n) => n * 2
};

export default ErrorDiffusion;
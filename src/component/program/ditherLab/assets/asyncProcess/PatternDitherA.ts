import { luma_srgb1 } from '../../../../../utils/etc/colorUtils';
import getPaletteColors from '../../utils/getColors';
import { AsyncProcess } from '../asyncProcess';
import { DitherLabOptions } from '../../DitherLab.state';
import { ProgressFn } from '../../utils/ProcessWorker';
import { gammaCorrect } from '../../utils/gamma';
import thresholds from '../thresholds';

const vec3distance = (a: number[], b: number[]): number => {
  return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]);
};

const mapAmount = (amt: number) => {
  return [0, 0.01, 0.02, 0.05, 0.1, 0.2, 0.35, 0.5, 0.8, 1][amt];
};

function processPatternDither(
  dataIn: ImageData,
  options: DitherLabOptions,
  settings: { [key: string]: number },
  cbProgress: ProgressFn | null
): ImageData {
  if (!options.palette.palette)
    throw new Error('runPatternDither: No palette selected');

  const palette = getPaletteColors(options.palette.palette);
  const size = dataIn.width * dataIn.height * 4;
  const line = dataIn.width * 4;

  const thresholdMap = thresholds[settings.threshold || 0];
  const gamma = settings.gamma || 2.2;
  const cError = mapAmount(settings.amount || 5);

  const clist: number[] = Array(settings.clist_size || 64).fill(-1);
  const target: number[] = [0, 0, 0];
  let color: number[];

  // Precalculate luma and gamma-corrected palette
  const pGamma = palette.map(c => gammaCorrect(c, gamma));
  const luma = pGamma.map(luma_srgb1);
  const iGamma = Array(dataIn.data.length).fill(0);

  // First pass, gamma-correct source image
  for (let i = 0; i < size; i += 4) {
    const correct = gammaCorrect(Array.from(dataIn.data.slice(i, i + 3)), gamma);
    for (let j = 0; j < 3; j++) iGamma[i + j] = correct[j];

    if (i % (line * 24) === 0 && cbProgress) cbProgress(i, size, dataIn);
  }

  for (let i = 0; i < size; i += 4) {
    color = Array.from(iGamma.slice(i, i + 4));
    const x = (i % line) / 4;
    const y = ~~(i / line);

    const ts = thresholdMap.size;
    const tsPadded = 4 * Math.ceil(ts / 4);
    const threshold = thresholdMap.data[x % ts + tsPadded * (y % ts)] / 255;

    const error = [0, 0, 0];
    clist.fill(-1);
    for (let j = 0; j < clist.length; j++) {
      for (let k = 0; k < 3; k++)
        target[k] = color[k] + error[k] * cError;

      let candidate = 0;
      let dMin = Number.MAX_VALUE;

      // Find the closest color from palette
      for (let k = 0; k < pGamma.length; k++) {
        const d = vec3distance(target, pGamma[k]);
        if (d < dMin) {
          dMin = d;
          candidate = k;
        }
      }

      // Add it to the candidate list
      clist[j] = candidate;

      // By adding the candidate's error to the next iteration,
      // the next candidate will compensate for that error thus
      // getting closer to the original color.
      for (let k = 0; k < 3; k++)
        error[k] = error[k] + color[k] - pGamma[candidate][k];
    }

    clist.sort((a, b) => luma[a] - luma[b]);

    let index = ~~(threshold * clist.length);
    if (index === clist.length) index = clist.length - 1;
    const chosen = clist[index];

    for (let j = 0; j < 3; j++)
        dataIn.data[i + j] = palette[chosen][j];
    
    if (i % (line * 4) === 0 && cbProgress) cbProgress(i, size, dataIn);
  }

  return dataIn;
}

const PatternDither: AsyncProcess = {
  id: 'ProcPatternDither',
  name: 'Pattern Dithering',
  run: processPatternDither,

  maxAllowedPaletteSize: 65536,
  supports: {
    threads: true,
    gamma: true
  },
  complexity: (n) => n * 64
};

export default PatternDither;
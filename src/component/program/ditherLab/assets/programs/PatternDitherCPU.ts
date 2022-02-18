import DitherLabProgram, { DitherLabDevice, DitherLabProgramSettingType } from '../../utils/DitherLabProgram';
import renderOnWorkers, { maxAutoThreads, threadsAvailable } from '../../utils/SoftwareRenderer';

const mapAmount = (amt: number) => {
  return [0, 0.01, 0.02, 0.05, 0.1, 0.2, 0.35, 0.5, 0.8, 1][amt];
};

const patternDitherCPU: DitherLabProgram = {
  device: DitherLabDevice.CPU,
  name: 'Pattern Dithering',
  settings: {
    threads: {
      name: 'Threads',
      type: DitherLabProgramSettingType.Range,
      min: 0,
      max: threadsAvailable,
      step: 1,
      default: 0,
      showValue: val => val === 0 ? 'AUTO' : val.toFixed(0).padStart(4, ' '),
      valueColor: val => {
        if (val === 0) return 'var(--ct-ok)';
        if (val > maxAutoThreads) return 'var(--ct-warn)';
        return 'inherit';
      }
    },
    threshold: {
      name: 'Matrix',
      type: DitherLabProgramSettingType.Combo,
      options: [
        { name: '8x8 Bayer Matrix', value: 0 },
        { name: '4x4 Bayer Matrix', value: 1 },
        { name: '64x64 Blue Noise', value: 2 },
        { name: '16x16 Blue Noise', value: 3 },
        { name: '8x8 Halftone', value: 4 },
        { name: '6x6 Halftone', value: 5 },
        { name: '4x4 Halftone', value: 6 }
      ]
    },
    clist_size: {
      name: 'Mix',
      type: DitherLabProgramSettingType.Combo,
      options: [
        { name: '64 level', value: 64 },
        { name: '16 level', value: 16 },
        { name: '4 level', value: 4 }
      ]
    },
    amount: {
      name: 'Dither',
      type: DitherLabProgramSettingType.Range,
      max: 9,
      step: 1,
      default: 5,
      showValue: val => mapAmount(val).toFixed(2)
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
  run: renderOnWorkers
};

export default patternDitherCPU;
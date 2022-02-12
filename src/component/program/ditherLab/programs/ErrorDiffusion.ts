import DitherLabProgram, { DitherLabDevice, DitherLabProgramSettingType } from '../DitherLabProgram';
import renderOnWorkers from '../SoftwareRenderer';

const errorDiffusion: DitherLabProgram = {
  device: DitherLabDevice.CPU,
  name: 'Error Diffusion',
  settings: {
    matrix: {
      name: 'Matrix',
      type: DitherLabProgramSettingType.Combo,
      options: [
        { name: 'Floyd-Steinberg', value: 0 },
        { name: 'JJ&N', value: 1 },
        { name: 'Stucki', value: 2 }
      ]
    },
    gamma: {
      name: 'Gamma',
      type: DitherLabProgramSettingType.Range,
      min: 1,
      max: 4,
      step: 0.2,
      default: 2.2,
      showValue: true
    }
  },
  run: renderOnWorkers
};

export default errorDiffusion;
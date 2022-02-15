import DitherLabProgram, { DitherLabDevice, DitherLabProgramSettingType } from '../../utils/DitherLabProgram';
import renderOnWorkers from '../../utils/SoftwareRenderer';

const errorDiffusion: DitherLabProgram = {
  device: DitherLabDevice.CPU,
  name: 'Error Diffusion',
  settings: {
    matrix: {
      name: 'Model',
      type: DitherLabProgramSettingType.Combo,
      options: [
        { name: 'Floyd-Steinberg', value: 0 },
        { name: 'JJ&N', value: 1 },
        { name: 'Stucki', value: 2 },
        { name: 'Sierra', value: 3 }
      ]
    },
    error_mult: {
      name: 'Diffuse',
      type: DitherLabProgramSettingType.Range,
      min: 0.5,
      max: 1,
      step: 0.1,
      default: 1,
      showValue: val => val.toFixed(1)
    },
    gamma: {
      name: 'Gamma',
      type: DitherLabProgramSettingType.Range,
      min: 1,
      max: 4,
      step: 0.2,
      default: 2.2,
      showValue: val => val.toFixed(1)
    }
  },
  run: renderOnWorkers
};

export default errorDiffusion;
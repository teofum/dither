import { ComboBoxOption } from '../../../ui/comboBox/ComboBox.props';
import { DitherLabOptions } from '../DitherLab.state';

export enum DitherLabDevice {
  CPU = 'Software',
  GL = 'WebGL'
}

export interface RenderControl {
  stop?: () => void;
}

type DitherLabProgramFn = (
  rt: HTMLCanvasElement,
  options: DitherLabOptions,
  control?: RenderControl
) => Promise<void>;

export enum DitherLabProgramSettingType {
  Input,
  Combo,
  Range
}

export interface DitherLabProgramSetting {
  name: string;
  type: DitherLabProgramSettingType;
  max?: number;
  min?: number;
  step?: number;
  options?: ComboBoxOption<number>[];
  default?: number;
  showValue?: (val: number) => string;
  valueColor?: (val: number) => string;
}

interface DitherLabProgram {
  device: DitherLabDevice;
  name: string;
  settings: { [key: string]: DitherLabProgramSetting };
  run: DitherLabProgramFn;
}

export default DitherLabProgram;
import ErrorDiffusion from './asyncProcess/ErrorDiffusion';
import { DitherLabOptions } from './DitherLab.state';
import { ProgressFn } from './ProcessWorker';

type ProcessFn = (
  dataIn: ImageData,
  options: DitherLabOptions,
  settings: { [key: string]: number },
  cbProgress: ProgressFn | null
) => ImageData;

export interface AsyncProcess {
  id: string;
  name: string;
  run: ProcessFn;

  maxAllowedPaletteSize: number;
  supports: {
    threads: boolean,
    gamma: boolean
  };
  complexity: (n: number) => number;
}

const asyncProcess = [
  ErrorDiffusion
];

export default asyncProcess;
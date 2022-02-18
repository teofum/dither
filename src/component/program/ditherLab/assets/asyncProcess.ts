import ErrorDiffusion from './asyncProcess/ErrorDiffusion';
import { DitherLabOptions } from '../DitherLab.state';
import { ProgressFn } from '../utils/ProcessWorker';
import PatternDither from './asyncProcess/PatternDitherA';

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
  ErrorDiffusion,
  PatternDither
];

export default asyncProcess;
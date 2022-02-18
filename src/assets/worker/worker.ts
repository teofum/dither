import asyncProcess from '../../component/program/ditherLab/assets/asyncProcess';
import { DitherLabOptions } from '../../component/program/ditherLab/DitherLab.state';
import { initGammaLUT } from '../../component/program/ditherLab/utils/gamma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any;

interface ProcWorkerStartArgs {
  dataIn: ImageData;
  options: DitherLabOptions;
}

enum ProcessEvent {
  Progress,
  Done,
  Error
}

type ProgressFn = ((current: number, total: number, partial?: ImageData) => void);

const reportProgress: ProgressFn = (current: number, total: number, partial?: ImageData) => {
  ctx.postMessage({ msg: ProcessEvent.Progress, params: { current, total, partial } });
};

ctx.addEventListener('message', (ev: MessageEvent) => {
  const msg = ev.data as ProcWorkerStartArgs;
  const procName = msg.options.process.process?.name;
  const settings = msg.options.process.settingValues;

  // Convert image using the passed process
  const process = asyncProcess.find(p => p.name === procName);

  if (!process) {
    ctx.postMessage({
      msg: ProcessEvent.Error,
      params: { error: `WorkerInit failed: process ${procName} not found` }
    });
    self.close();
    return;
  }

  initGammaLUT(settings.gamma || 2.2);

  process.run(msg.dataIn, msg.options, settings, reportProgress);
  ctx.postMessage({ msg: ProcessEvent.Done, params: { result: msg.dataIn } });
  self.close();
});
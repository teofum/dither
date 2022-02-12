import { ImagePart } from '../../../utils/ditherLab/RenderUtils';
import ProcWorker from '../../../assets/worker/worker?worker';
import { DitherLabOptions } from './DitherLab.state';

enum ProcessEvent {
  Progress,
  Done,
  Error
}

interface ProcessWorkerMsg {
  msg: ProcessEvent;
  params: any;
}

export type ProgressFn = ((current: number, total: number, partial?: ImageData) => void);

// Wraps the process worker and abstracts the messages
class ProcessWorker {
  private worker: Worker;
  private busy: boolean = false;
  private x: number = 0;
  private y: number = 0;

  public onprogress: ((progress: { current: number, total: number, partial?: ImagePart }) => void) | undefined;
  public onfinish: ((result: ImagePart) => void) | undefined;
  public onerror: ((message: string) => void) | undefined;

  public get ready(): boolean { return !this.busy; }

  constructor() {
    this.worker = new ProcWorker();

    this.worker.onmessage = (ev: MessageEvent) => {
      const msg = ev.data as ProcessWorkerMsg;
      switch (msg.msg) {
        case ProcessEvent.Progress:
          if (this.onprogress) this.onprogress({
            ...msg.params,
            partial: msg.params.partial ?
              { data: msg.params.partial, x: this.x, y: this.y } :
              undefined
          });
          break;

        case ProcessEvent.Done:
          if (this.onfinish) this.onfinish({
            data: msg.params.result,
            x: this.x, y: this.y
          });
          this.busy = false;
          break;

        case ProcessEvent.Error:
          if (this.onerror) this.onerror(msg.params.error);
          this.busy = false;
          break;
      }
    };
  }

  public start(
    part: ImagePart,
    options: DitherLabOptions
  ): boolean {
    if (this.busy) return false;
    this.busy = true;

    this.worker.postMessage({
      dataIn: part.data,
      options: {
        palette: options.palette,
        process: {
          process: {
            name: options.process.process?.name
          },
          settingValues: options.process.settingValues
        }
      }
    });
    return true;
  }

  public terminate(): void {
    this.worker.terminate();
  }
}

export default ProcessWorker;
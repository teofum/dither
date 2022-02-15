import { getPaletteSize } from './getColors';
import { ImagePart } from './RenderUtils';
import asyncProcess from '../assets/asyncProcess';
import { DitherLabOptions } from '../DitherLab.state';
import ProcessWorker from './ProcessWorker';

export const threadsAvailable = navigator.hardwareConcurrency;
export const maxAutoThreads = Math.max(~~(threadsAvailable / 2), 1);

const activeWorkers: ProcessWorker[] = [];

const renderOnWorkers = (
  rt: HTMLCanvasElement,
  options: DitherLabOptions
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const input = options.image.element;
    if (!input) throw new Error('Image is null');

    const ctx = rt.getContext('2d');
    if (!ctx) throw new Error('Unable to get output context');

    const temp = document.createElement('canvas');
    temp.width = rt.width;
    temp.height = rt.height;

    const ctxTemp = temp.getContext('2d');
    if (!ctxTemp) throw new Error('Unable to get temp context');

    ctxTemp.drawImage(input, 0, 0, rt.width, rt.height);

    const procName = options.process.process?.name;
    const asyncProcessToUse = asyncProcess.find(p => p.name === procName);
    if (!asyncProcessToUse) throw new Error(`Could not find async process ${procName}`);

    const settings = options.process.settingValues;
    const palette = options.palette.palette;
    if (!palette) throw new Error('Palette is null');

    // Set the number of threads to use
    let nThreads: number;
    if (!asyncProcessToUse.supports.threads) nThreads = 1;
    else if (settings.autoThreads) {
      // Calculate the number of threads needed based on
      // process complexity and image size
      const cr = asyncProcessToUse.complexity(getPaletteSize(palette));
      const size = rt.width * rt.height;

      // Assign roughly one thread per 50k pixels for a complexity rating of 2048
      // CR=2048 is a 64 color palette at O(n²/2) or 8 color palette at O(n²/2 * 64)
      const wantThreads = ~~(size / 50000 * cr / 2048) + 1;

      // Need at least one thread, limit to max auto threads (half the available threads)
      nThreads = (wantThreads > maxAutoThreads ? maxAutoThreads : wantThreads);

      console.log(`Want ${wantThreads} threads for ${size}px @CR${cr}, got ${nThreads} (max ${maxAutoThreads})`);
    } else nThreads = settings.threads || 1;
    let activeThreads: number = 0;

    // Ensure part width is a multiple of 8, prevents dithering seams
    const partWidth = ~~(rt.width / nThreads / 8) * 8;
    // Account for the last few pixels that may have been lost in rounding
    const error = rt.width - (partWidth * nThreads);

    const startTime = new Date().getTime();
    for (let t = 0; t < nThreads; t++) {
      const err8 = ~~(error / 8);
      const x = t * partWidth + 8 * (err8 < t ? err8 : t);
      const w = partWidth + (t === nThreads - 1 ? error % 8 : err8 > t ? 8 : 0);
      const partData = ctxTemp.getImageData(x, 0, w, rt.height);
      if (!partData) reject('Unable to get image data from context');

      const part: ImagePart = { data: partData, x: x, y: 0 };
      const worker = new ProcessWorker();

      worker.onprogress = (progress) => {
        const line = progress.current / (w * 4);

        if (progress.partial)
          ctx.putImageData(progress.partial.data, x, 0);

        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(x, line, w, 2);
      };

      worker.onfinish = (result) => {
        ctx.putImageData(result.data, x, 0);

        activeThreads--;
        activeWorkers.splice(activeWorkers.indexOf(worker), 1);

        const endTime = new Date().getTime();
        console.log(`Worker thread ${t + 1} done in ${endTime - startTime}ms`);

        if (activeThreads === 0) {
          console.log(`${nThreads} worker threads done in ${endTime - startTime}ms`);
          resolve();
        }
      };

      worker.onerror = (error) => reject(`Error in worker thread: ${error}`);

      console.log(`Starting worker thread ${t + 1}/${nThreads} w=${w}`);
      worker.start(part, options);
      activeThreads++;
      activeWorkers.push(worker);
    }
  });
};

export default renderOnWorkers;
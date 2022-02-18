import Palette from './utils/Palette';
import PaletteGroup from './utils/PaletteGroup';
import DitherLabProgram, { DitherLabDevice, RenderControl } from './utils/DitherLabProgram';

export type RTType = React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export interface ImageInfo {
  src: string;
  filename: string;
  width: number;
  height: number;
  meta: { prop: string, value: string }[];
}

export interface ImageOptions {
  info: ImageInfo;
  element: HTMLImageElement | null;
}

export enum DlabResizeMode {
  KeepOriginalSize,
  FitToSize,
  ForceResize
}

export interface ResizeOptions {
  mode: DlabResizeMode;
  x: number;
  y: number;
}

export interface PaletteOptions {
  group: PaletteGroup;
  palette: Palette | null;
  customPalettes: Palette[];
}

export interface ProcessOptions {
  device: DitherLabDevice;
  process: DitherLabProgram | null;
  settingValues: { [key: string]: number };
}

export interface DitherLabOptions {
  image: ImageOptions;
  resize: ResizeOptions;
  palette: PaletteOptions;
  process: ProcessOptions;
  liveRender: boolean;
}

export enum DlabRenderStatus {
  Ready = 'Ready',
  Rendering = 'Rendering...',
  Done = 'Done',
  Stopped = 'Stopped'
}

export interface DitherLabStatus {
  renderStatus: DlabRenderStatus;
  lastRenderTime: number;
  renderWidth: number;
  renderHeight: number;
}

export interface DitherLabViewState {
  scale: number;
  showEditor: boolean;
}

interface DitherLabState {
  renderTarget: RTType | null;
  renderControl: RenderControl;
  options: DitherLabOptions;
  status: DitherLabStatus;
  view: DitherLabViewState;
};

export default DitherLabState;

export const dlabInitialState: DitherLabState = {
  renderTarget: null,
  renderControl: {},
  options: {
    image: {
      info: {
        src: '',
        filename: '',
        width: 0,
        height: 0,
        meta: []
      },
      element: null
    },
    resize: {
      mode: DlabResizeMode.KeepOriginalSize,
      x: 800,
      y: 600
    },
    palette: {
      group: PaletteGroup.RetroPC,
      palette: null,
      customPalettes: []
    },
    process: {
      device: DitherLabDevice.GL,
      process: null,
      settingValues: {}
    },
    liveRender: true
  },
  status: {
    renderStatus: DlabRenderStatus.Ready,
    lastRenderTime: 0,
    renderWidth: 0,
    renderHeight: 0
  },
  view: {
    scale: 1,
    showEditor: false
  }
};
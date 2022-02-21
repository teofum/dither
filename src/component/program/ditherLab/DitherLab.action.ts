import createAction from '../../../utils/state/createAction';
import { DitherLabStatus, DlabRenderStatus, DlabResizeMode, ImageInfo, RTType } from './DitherLab.state';
import DitherLabProgram, { DitherLabDevice, RenderControl } from './utils/DitherLabProgram';
import Palette from './utils/Palette';
import PaletteGroup from './utils/PaletteGroup';

const dlabActions = {
  setRenderTarget: createAction<RTType | null>('renderTarget'),
  setRenderControl: createAction<RenderControl>('renderControl'),

  setImageInfo: createAction<ImageInfo>('options/image/info'),
  setImageElement: createAction<HTMLImageElement | null>('options/image/element'),
  
  setResizeMode: createAction<DlabResizeMode>('options/resize/mode'),
  resize: createAction<{ w: number, h: number }>('options/resize/size'),

  setPaletteGroup: createAction<PaletteGroup>('options/palette/group'),
  setPalette: createAction<Palette | null>('options/palette/palette'),
  setCustomPalettes: createAction<Palette[]>('options/palette/custom'),

  setDevice: createAction<DitherLabDevice>('options/process/device'),
  setProcess: createAction<DitherLabProgram | null>('options/process/process'),
  setProcSettings: createAction<{ [key: string]: number }>('options/process/settings'),
  setProcSetting: createAction<{ setting: string, value: number }>('options/process/setting'),

  setLiveRender: createAction<boolean>('options/liveRender'),

  setStatus: createAction<DitherLabStatus>('status/status'),
  setRenderStatus: createAction<DlabRenderStatus>('status/renderStatus'),
  setRenderTime: createAction<number>('status/time'),
  setRenderSize: createAction<{ w: number, h: number }>('status/size'),

  zoomIn: createAction<void>('view/zoom/in'),
  zoomOut: createAction<void>('view/zoom/out'),
  resetZoom: createAction<void>('view/zoom/reset'),
  showPaletteEditor: createAction<void>('view/showPaletteEditor'),
  hidePaletteEditor: createAction<void>('view/hidePaletteEditor')
};

export default dlabActions;
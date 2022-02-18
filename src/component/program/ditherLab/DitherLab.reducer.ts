import createReducerAndActions from '../../../utils/state/createStateMgr';
import DitherLabState from './DitherLab.state';

const dlabState = createReducerAndActions<DitherLabState>({
  renderTarget: (state, action) => state.renderTarget = action.payload,
  options: {
    image: {
      info: (state, action) => state.options.image.info = action.payload,
      element: (state, action) => state.options.image.element = action.payload
    },
    resize: {
      mode: (state, action) => state.options.resize.mode = action.payload,
      size: (state, action) => {
        state.options.resize.x = action.payload.w;
        state.options.resize.y = action.payload.h;
      }
    },
    palette: {
      group: (state, action) => state.options.palette.group = action.payload,
      palette: (state, action) => state.options.palette.palette = action.payload,
      custom: (state, action) => state.options.palette.customPalettes = action.payload
    },
    process: {
      device: (state, action) => state.options.process.device = action.payload,
      process: (state, action) => state.options.process.process = action.payload,
      settings: (state, action) => state.options.process.settingValues = action.payload,
      setting: (state, action) => {
        state.options.process.settingValues[action.payload.setting] = action.payload.value;
      }
    },
    liveRender: (state, action) => state.options.liveRender = action.payload
  },
  status: {
    status: (state, action) => state.status = action.payload,
    renderStatus: (state, action) => state.status.renderStatus = action.payload,
    time: (state, action) => state.status.lastRenderTime = action.payload,
    size: (state, action) => {
      state.status.renderWidth = action.payload.w;
      state.status.renderHeight = action.payload.h;
    }
  },
  view: {
    scale: (state, action) => state.view.scale = action.payload,
    showPaletteEditor: (state) => state.view.showEditor = true,
    hidePaletteEditor: (state) => state.view.showEditor = false
  }
});

export default dlabState;
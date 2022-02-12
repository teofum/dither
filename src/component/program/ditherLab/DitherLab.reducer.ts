import DitherLabAction, { DitherLabActionType } from './DitherLab.action';
import DitherLabState, { DitherLabOptions, DitherLabStatus, ImageOptions, PaletteOptions, ProcessOptions, ResizeOptions, RTType } from './DitherLab.state';

const dlabReducer = (
  state: DitherLabState,
  action: DitherLabAction
): DitherLabState => {
  switch (action.type) {
    case DitherLabActionType.RenderTarget:
      return {
        ...state,
        renderTarget: action.payload as (RTType | null)
      };
    case DitherLabActionType.Options:
      return {
        ...state,
        options: action.payload as DitherLabOptions
      };
    case DitherLabActionType.Image:
      return {
        ...state,
        options: {
          ...state.options,
          image: action.payload as ImageOptions
        }
      };
    case DitherLabActionType.Resize:
      return {
        ...state,
        options: {
          ...state.options,
          resize: action.payload as ResizeOptions
        }
      };
    case DitherLabActionType.Palette:
      return {
        ...state,
        options: {
          ...state.options,
          palette: action.payload as PaletteOptions
        }
      };
    case DitherLabActionType.Process:
      return {
        ...state,
        options: {
          ...state.options,
          process: action.payload as ProcessOptions
        }
      };
    case DitherLabActionType.Live:
      return {
        ...state,
        options: {
          ...state.options,
          liveRender: action.payload as boolean
        }
      };
    case DitherLabActionType.Status:
      return {
        ...state,
        status: action.payload as DitherLabStatus
      };
    case DitherLabActionType.View:
      return {
        ...state,
        view: action.payload as number
      };
    default:
      console.warn(`dlabReducer: bad action type '${action.type}'`);
      return state;
  }
};

export default dlabReducer;
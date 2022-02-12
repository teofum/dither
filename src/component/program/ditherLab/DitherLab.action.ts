export enum DitherLabActionType {
  Options = 'options',
  Image = 'image',
  Resize = 'resize',
  Palette = 'palette',
  Process = 'process',
  Live = 'live',
  RenderTarget = 'renderTarget',
  Status = 'status',
  View = 'view'
}

interface DitherLabAction {
  type: DitherLabActionType;
  payload: unknown;
}

export default DitherLabAction;
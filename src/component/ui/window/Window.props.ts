import WindowContent from './WindowContent';

interface WindowState {
  content: WindowContent;
  contentProps?: unknown;

  // Basic properties
  id: number;
  title: string;
  iconUrl?: string;

  // Size
  minWidth: number;
  minHeight: number;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;

  resizeable?: boolean;
  autoSize?: boolean;

  maximizable?: boolean;
  closeable?: boolean;

  // Positioning
  top?: number;
  left?: number;

  // Depth
  zIndex: number;
  active: boolean;
}

export default WindowState;
export type WindowTemplate = Omit<WindowState, 'id' | 'zIndex' | 'active'>;
export type WindowProps = WindowState & { children?: React.ReactNode };
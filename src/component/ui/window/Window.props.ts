import React from 'react';

interface WindowProps {
  children?: React.ReactNode;

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

  // Events
  onClose?: (id: number) => void;
  onFocus?: (id: number) => void;
}

export default WindowProps;
export type WindowTemplate = Omit<WindowProps, 'id'>;
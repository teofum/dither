import React from 'react';
import ComboBox from '../../../ui/comboBox/ComboBox';
import { DlabResizeMode, ResizeOptions } from '../DitherLab.state';

import '../DitherLab.css';
import OptionsProps from './options.props';
import dlabActions from '../DitherLab.action';

const resizeModes = [
  { value: DlabResizeMode.KeepOriginalSize, name: 'Keep original size' },
  { value: DlabResizeMode.FitToSize, name: 'Fit to size' },
  { value: DlabResizeMode.ForceResize, name: 'Force resize' }
];

function DitherLabResizeOptions(props: OptionsProps<ResizeOptions>) {
  const { mode, x, y } = props.slice;

  const blockNonDigits = (ev: Event) => {
    const key = (ev as KeyboardEvent).key;
    if (key !== 'Backspace' && !key.match(/[0-9]/) && !key.startsWith('Arrow'))
      ev.preventDefault();
  };

  const input = (ev: Event, propName: 'x' | 'y') => {
    const iev = ev as InputEvent;
    const value = parseInt((iev.target as HTMLInputElement).value);

    const newSize = propName === 'x' ?
      { w: value || 0, h: y } :
      { w: x, h: value || 0 };
    props.dispatch(dlabActions.resize(newSize));
  };

  return (
    <div className='dlab-resize-root'>
      <ComboBox value={mode} options={resizeModes}
        onChange={(e) => props.dispatch(
          dlabActions.setResizeMode(e.selected.value)
        )} />

      <div className='dlab-resize-inputs'>
        <input type='number' className='bevel' value={x}
          disabled={mode === DlabResizeMode.KeepOriginalSize}
          onKeyDown={(e) => blockNonDigits(e.nativeEvent)}
          onInput={(e) => input(e.nativeEvent, 'x')} />
        <span>x</span>
        <input type='number' className='bevel' value={y}
          disabled={mode === DlabResizeMode.KeepOriginalSize}
          onKeyDown={(e) => blockNonDigits(e.nativeEvent)}
          onInput={(e) => input(e.nativeEvent, 'y')} />
      </div>
    </div>
  );
}

export default DitherLabResizeOptions;
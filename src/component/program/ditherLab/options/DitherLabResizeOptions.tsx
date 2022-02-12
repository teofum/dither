import React from 'react';
import ComboBox from '../../../ui/comboBox/ComboBox';
import { DlabResizeMode, ResizeOptions } from '../DitherLab.state';

import '../DitherLab.css';
import OptionsProps from './options.props';

const resizeModes = [
  { value: DlabResizeMode.KeepOriginalSize, name: 'Keep original size' },
  { value: DlabResizeMode.FitToSize, name: 'Fit to size' },
  { value: DlabResizeMode.ForceResize, name: 'Force resize' }
];

function DitherLabResizeOptions(props: OptionsProps<ResizeOptions>) {
  const update = (newState: ResizeOptions) => {
    props.onChange(newState);
  };

  const blockNonDigits = (ev: Event) => {
    const key = (ev as KeyboardEvent).key;
    if (key !== 'Backspace' && !key.match(/[0-9]/) && !key.startsWith('Arrow'))
      ev.preventDefault();
  };

  const input = (ev: Event, propName: 'x' | 'y') => {
    const iev = ev as InputEvent;
    const value = (iev.target as HTMLInputElement).value;

    update({
      ...props.options,
      [propName]: parseInt(value || '0')
    });
  };

  return (
    <div className='dlab-resize-root'>
      <ComboBox value={props.options.mode} options={resizeModes}
        onChange={(e) => update({
          ...props.options,
          mode: e.selected.value
        })} />

      <div className='dlab-resize-inputs'>
        <input type='number' className='bevel' value={props.options.x}
          disabled={props.options.mode === DlabResizeMode.KeepOriginalSize}
          onKeyDown={(e) => blockNonDigits(e.nativeEvent)}
          onInput={(e) => input(e.nativeEvent, 'x')} />
        <span>x</span>
        <input type='number' className='bevel' value={props.options.y}
          disabled={props.options.mode === DlabResizeMode.KeepOriginalSize}
          onKeyDown={(e) => blockNonDigits(e.nativeEvent)}
          onInput={(e) => input(e.nativeEvent, 'y')} />
      </div>
    </div>
  );
}

export default DitherLabResizeOptions;
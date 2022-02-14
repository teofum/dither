import React from 'react';
import Palette from '../../../../utils/ditherLab/Palette';
import PaletteGroup from '../../../../utils/ditherLab/PaletteGroup';
import PaletteType from '../../../../utils/ditherLab/PaletteType';
import { PaletteOptions } from '../DitherLab.state';
import OptionsProps from './options.props';

function DitherLabPaletteInfo(props: OptionsProps<PaletteOptions>) {
  const update = (newState: PaletteOptions) => {
    props.onChange(newState);
  };

  const makeCustomFromCurrent = () => {
    const current = props.options.palette;
    if (!current) return;

    const newPalette: Palette = {
      name: current.name + ' Copy',
      group: PaletteGroup.User,
      type: current.type,
      data: current.data.slice()
    };

    update({
      ...props.options,
      customPalettes: props.options.customPalettes.concat(newPalette),
      group: PaletteGroup.User,
      palette: newPalette
    });
  };

  const hex = (color: number[]) => {
    return `#${color.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  };

  const data = props.options.palette?.data;
  const getInfoItem = (type: string) => {
    if (!data) return;
    switch (type) {
      case 'length':
        return (data.length || 0) / 3;
      case 'bpc': {
        const len = data[0] * data[1] * data[2];
        return `${len} (${data[0]} x ${data[1]} x ${data[2]})`;
      }
      case 'mono-lv':
        return data[0];
      case 'mono-min':
        return data[1];
      case 'mono-base':
        return hex(data.slice(2, 5));
    }
  };

  let info: JSX.Element[] = [];
  switch (props.options.palette?.type) {
    case PaletteType.Indexed:
      info = [
        (<span key={0} className='dlab-editor-info-label'>Colors</span>),
        (<input key={1} readOnly className='bevel'
          value={getInfoItem('length')} />)
      ];
      break;
    case PaletteType.RGB:
      info = [
        (<span key={0} className='dlab-editor-info-label'>Levels</span>),
        (<input key={1} readOnly className='bevel'
          value={getInfoItem('bpc')} />)
      ];
      break;
    case PaletteType.Mono:
      info = [
        (<span key={0} className='dlab-editor-info-label'>Levels</span>),
        (<input key={1} readOnly className='bevel'
          value={getInfoItem('mono-lv')} />),
        (<span key={2} className='dlab-editor-info-label'>Min lv.</span>),
        (<input key={3} readOnly className='bevel'
          value={getInfoItem('mono-min')} />),
        (<span key={4} className='dlab-editor-info-label'>Base</span>),
        (<div key={5} className='dlab-editor-info-color'>
          <div className='bevel content' style={{ background: `${getInfoItem('mono-base')}` }} />
          <input readOnly className='bevel'
            value={getInfoItem('mono-base')} />
        </div>)
      ];
      break;
    case PaletteType.Mixer:
      info = [(<span key={0}>TODO</span>)];
      break;
  }

  return (
    <div className='dlab-editor-root'>
      <div className='dlab-editor-title wide'>
        {props.options.palette?.name}
      </div>

      <span className='dlab-editor-info-label'>Group</span>
      <input readOnly className='dlab-editor-info-value bevel'
        value={props.options.palette?.group} />

      <span className='dlab-editor-info-label'>Type</span>
      <input readOnly className='dlab-editor-info-value bevel'
        value={props.options.palette?.type} />

      {info}

      <hr className='divider horizontal bevel' />

      <div className='wide'>
        Editing is disabled for preset palettes.
        To edit this palette, create a copy first.
      </div>

      <button className='bevel wide' onClick={makeCustomFromCurrent}>
        Copy as custom palette
      </button>
    </div>
  );
}

export default DitherLabPaletteInfo;
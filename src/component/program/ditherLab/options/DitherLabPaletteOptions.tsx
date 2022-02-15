import React from 'react';
import ComboBox from '../../../ui/comboBox/ComboBox';
import OptionsProps from './options.props';
import { PaletteOptions } from '../DitherLab.state';

import PaletteGroup from '../utils/PaletteGroup';
import getPaletteColors from '../utils/getColors';
import palettes from '../assets/palettes';

import '../DitherLab.css';
import classlist from '../../../../utils/etc/classlist';
import dlabActions from '../DitherLab.action';

function DitherLabPaletteOptions(props: OptionsProps<PaletteOptions>) {
  const { group, palette, customPalettes } = props.slice;

  const allPalettes = palettes.concat(customPalettes);

  const pgOptions = Object.values(PaletteGroup)
    .filter(val => !val.startsWith('__'))
    .filter(val => allPalettes.filter(p => p.group === val).length > 0)
    .map(val => ({ name: val, value: val }));

  const palOptions = allPalettes
    .filter(pal => pal.group === group)
    .map(pal => ({ name: pal.name, value: pal }));

  const colors = palette && getPaletteColors(palette);
  const cl = colors?.length || 0;
  const sizeClass = cl > 64 ? 'smaller' : cl > 32 ? 'small' : '';
  return (
    <div className='dlab-palette-root'>
      <ComboBox options={pgOptions} value={group}
        onChange={(e) => props.dispatch(
          dlabActions.setPaletteGroup(e.selected.value)
        )} />

      <ComboBox options={palOptions} value={palette}
        onChange={(e) => props.dispatch(
          dlabActions.setPalette(e.selected.value)
        )} />

      {colors &&
        <div className={classlist('dlab-palette-preview', sizeClass)}>
          {colors.map((c, i) => (
            <div key={i} className='dlab-palette-swatch bevel content'
              style={{ background: `rgb(${c[0]}, ${c[1]}, ${c[2]})` }} />
          ))}
        </div>}

      <button className='bevel' onClick={() => props.dispatch(
        dlabActions.showPaletteEditor()
      )}>
        Palette Editor
      </button>
    </div>
  );
}

export default DitherLabPaletteOptions;
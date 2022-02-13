import React from 'react';
import ComboBox from '../../../ui/comboBox/ComboBox';
import OptionsProps from './options.props';
import { PaletteOptions } from '../DitherLab.state';

import PaletteGroup from '../../../../utils/ditherLab/PaletteGroup';
import getPaletteColors from '../../../../utils/ditherLab/getColors';
import palettes from '../../../../assets/palettes';

import '../DitherLab.css';
import classlist from '../../../../utils/etc/classlist';

const pgOptions = Object.values(PaletteGroup)
  .filter(val => !val.startsWith('__'))
  .filter(val => palettes.filter(p => p.group === val).length > 0)
  .map(val => ({ name: val, value: val }));

function DitherLabPaletteOptions(props: OptionsProps<PaletteOptions>) {
  const update = (newState: PaletteOptions) => {
    props.onChange(newState);
  };

  const palOptions = palettes
    .filter(pal => pal.group === props.options.group)
    .map(pal => ({ name: pal.name, value: pal }));

  const colors = props.options.palette && getPaletteColors(props.options.palette);
  const cl = colors?.length || 0;
  const sizeClass = cl > 64 ? 'smaller' : cl > 32 ? 'small' : '';
  return (
    <div className='dlab-palette-root'>
      <ComboBox options={pgOptions} value={props.options.group}
        onChange={(e) => update({
          ...props.options,
          group: e.selected.value
        })} />

      <ComboBox options={palOptions} value={props.options.palette}
        onChange={(e) => update({
          ...props.options,
          palette: e.selected.value
        })} />

      {colors &&
        <div className={classlist('dlab-palette-preview', sizeClass)}>
          {colors.map((c, i) => (
            <div key={i} className='dlab-palette-swatch bevel content'
              style={{ background: `rgb(${c[0]}, ${c[1]}, ${c[2]})` }} />
          ))}
        </div>}

      <button className="bevel">Edit palette</button>
    </div>
  );
}

export default DitherLabPaletteOptions;
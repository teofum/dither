import React, { useState } from 'react';
import getPaletteColors, { getPaletteColor } from '../utils/getColors';
import Palette from '../utils/Palette';
import PaletteType from '../utils/PaletteType';
import classlist from '../../../../utils/etc/classlist';
import { PaletteOptions } from '../DitherLab.state';
import OptionsProps from './options.props';

import ui_remove from '../../../../assets/ui/remove.png';
import dlabActions from '../DitherLab.action';
import { hex } from '../../../../utils/etc/colorUtils';
import ColorPicker from '../../../ui/colorPicker/ColorPicker';

function DitherLabPaletteEditor(props: OptionsProps<PaletteOptions>) {
  const { palette, customPalettes } = props.slice;
  const [editing, setEditing] = useState<number>();

  if (!palette) return (<span>[No palette selected]</span>);

  const update = (updated: Palette) => {
    // Replace old with updated palette in custom palette list
    const newCustomPalettes = customPalettes
      .filter(p => p !== palette)
      .concat(updated);

    // Also set selected palette to the new one
    props.dispatch(dlabActions.setCustomPalettes(newCustomPalettes));
    props.dispatch(dlabActions.setPalette(updated));
  };

  const updateName = (ev: Event) => {
    update({
      ...palette,
      name: (ev.target as HTMLInputElement).value
    });
  };

  const setColor = (color: number[]) => {
    if (editing === undefined) return;

    const newData = palette.data.slice();
    const i = editing * 3;
    for (let ch = 0; ch < 3; ch++)
      newData[i + ch] = color[ch];

    update({
      ...palette,
      data: newData
    });
  };

  const addColor = () => {
    const newData = palette.data.concat([0, 0, 0]);
    update({
      ...palette,
      data: newData
    });

    setEditing(newData.length / 3 - 1);
  };

  const removeColor = (i: number) => {
    const newData = palette.data.slice(0, i * 3)
      .concat(palette.data.slice(i * 3 + 3));

    if (editing !== undefined && editing >= (newData.length / 3))
      setEditing(newData.length / 3 - 1);

    update({
      ...palette,
      data: newData
    });
  };

  const options: JSX.Element[] = [];

  switch (palette.type) {
    case PaletteType.Indexed: {
      let i = 0;
      options.push(<span key={i} className='dlab-editor-title wide'>Colors</span>);
      for (const color of getPaletteColors(palette)) {
        const asHex = hex(color);
        const index = i;
        options.push(
          <div key={i + 1}
            className={classlist('dlab-editor-color wide', i === editing ? 'selected' : '')}>
            <div className='bevel content' style={{ background: asHex }}
              onClick={() => setEditing(index)} />
            <input readOnly className='dlab-editor-color-input bevel'
              value={asHex} onClick={() => setEditing(index)} />
            {palette.data.length > 3 &&
              <button className="icon-button bevel light hover"
                onClick={() => removeColor(index)}>
                <img src={ui_remove} alt='remove' />
              </button>}
          </div>);
        i++;
      }
      options.push(<button key={i + 1} className='bevel' onClick={addColor}>Add Color</button>);
      break;
    }
    default:
      options.push(<span key={0}>Unsupported palette type. Sorry :(</span>);
      break;
  }

  const editingColor = getPaletteColor(palette, editing || 0);
  return (
    <div className='dlab-editor-root'>
      <input type='text' className='bevel wide'
        value={palette.name}
        onInput={e => updateName(e.nativeEvent)} />

      {options}

      <hr className='divider horizontal bevel' />

      {editing !== undefined ?
        <div className='dlab-editor-picker wide'>
          <ColorPicker value={editingColor}
            onChange={setColor} />
        </div>
        : <div className='wide'>
          Click on a color to edit.
        </div>}

    </div>
  );
}

export default DitherLabPaletteEditor;
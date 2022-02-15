import React from 'react';
import Palette from '../utils/Palette';
import PaletteGroup from '../utils/PaletteGroup';
import PaletteType from '../utils/PaletteType';
import { PaletteOptions } from '../DitherLab.state';
import DitherLabPaletteEditor from './DitherLabPaletteEditor';
import DitherLabPaletteInfo from './DitherLabPaletteInfo';
import OptionsProps from './options.props';
import Win4bRGBI from '../assets/palette/Win4bRGBI';

function DitherLabEditorPane(props: OptionsProps<PaletteOptions>) {
  const update = (newState: PaletteOptions) => {
    props.onChange(newState);
  };

  const newPalette = () => {
    const newPalette: Palette = {
      name: 'My Custom Palette',
      group: PaletteGroup.User,
      type: PaletteType.Indexed,
      data: [0, 0, 0, 255, 255, 255]
    };

    update({
      ...props.options,
      customPalettes: props.options.customPalettes.concat(newPalette),
      group: PaletteGroup.User,
      palette: newPalette
    });
  };

  const newFromCurrent = () => {
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

  const deleteCurrent = () => {
    const current = props.options.palette;
    const newCustomPalettes = props.options.customPalettes.filter(p => p !== current);
    const next = newCustomPalettes.length > 0 ? newCustomPalettes[0] : Win4bRGBI;

    update({
      ...props.options,
      customPalettes: newCustomPalettes,
      group: next.group,
      palette: next
    });
  };

  return (
    <div className='dlab-editor-container'>
      <div className='dlab-editor-bar'>
        <button className='bevel' onClick={newPalette}>
          New
        </button>
        <button className='bevel' onClick={newFromCurrent}>
          Duplicate
        </button>
        <button className='bevel' onClick={deleteCurrent}
          disabled={props.options.palette?.group !== PaletteGroup.User}>
          Delete
        </button>
      </div>
      <hr className='divider horizontal bevel' />

      {props.options.palette?.group === PaletteGroup.User ?
        <DitherLabPaletteEditor {...props} /> :
        <DitherLabPaletteInfo {...props} />}
    </div>);
}

export default DitherLabEditorPane;
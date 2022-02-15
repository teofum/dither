import React from 'react';
import Palette from '../utils/Palette';
import PaletteGroup from '../utils/PaletteGroup';
import PaletteType from '../utils/PaletteType';
import DitherLabPaletteEditor from './DitherLabPaletteEditor';
import DitherLabPaletteInfo from './DitherLabPaletteInfo';
import Win4bRGBI from '../assets/palette/Win4bRGBI';
import dlabActions from '../DitherLab.action';
import OptionsProps from './options.props';
import { PaletteOptions } from '../DitherLab.state';

function DitherLabEditorPane(props: OptionsProps<PaletteOptions>) {
  const { palette, customPalettes } = props.slice;

  const newPalette = () => {
    const newPalette: Palette = {
      name: 'My Custom Palette',
      group: PaletteGroup.User,
      type: PaletteType.Indexed,
      data: [0, 0, 0, 255, 255, 255]
    };

    props.dispatch(dlabActions.setCustomPalettes(customPalettes.concat(newPalette)));
    props.dispatch(dlabActions.setPaletteGroup(PaletteGroup.User));
    props.dispatch(dlabActions.setPalette(newPalette));
  };

  const newFromCurrent = () => {
    const current = palette;
    if (!current) return;

    const newPalette: Palette = {
      name: current.name + ' Copy',
      group: PaletteGroup.User,
      type: current.type,
      data: current.data.slice()
    };

    props.dispatch(dlabActions.setCustomPalettes(customPalettes.concat(newPalette)));
    props.dispatch(dlabActions.setPaletteGroup(PaletteGroup.User));
    props.dispatch(dlabActions.setPalette(newPalette));
  };

  const deleteCurrent = () => {
    const current = palette;
    const newCustomPalettes = customPalettes.filter(p => p !== current);
    const next = newCustomPalettes.length > 0 ? newCustomPalettes[0] : Win4bRGBI;


    props.dispatch(dlabActions.setCustomPalettes(newCustomPalettes));
    props.dispatch(dlabActions.setPaletteGroup(next.group));
    props.dispatch(dlabActions.setPalette(next));
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
          disabled={palette?.group !== PaletteGroup.User}>
          Delete
        </button>
      </div>
      <hr className='divider horizontal bevel' />

      {palette?.group === PaletteGroup.User ?
        <DitherLabPaletteEditor {...props} /> :
        <DitherLabPaletteInfo {...props} />}
    </div>);
}

export default DitherLabEditorPane;
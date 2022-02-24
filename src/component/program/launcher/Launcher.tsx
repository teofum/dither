import React from 'react';
import LauncherItem from './LauncherItem';
import themeEditorWindow from '../../ui/window/templates/ThemeEditor.window';
import ditherLabWindow from '../../ui/window/templates/DitherLab.window';
import helpWindow from '../../ui/window/templates/Help.window';
import minesweeperWindow from '../../ui/window/templates/Minesweeper.window';
import sudokuWindow from '../../ui/window/templates/Sudoku.window';

import { useAppDispatch } from '../../../hooks';
import { createWindow } from '../../ui/windowManager/windowSlice';

import icon_theme_l from '../../../assets/icon/theme_32.png';
import icon_help_l from '../../../assets/icon/help_32.png';
import icon_dlab_l from '../../../assets/icon/dlab_32.png';
import icon_mine_l from '../../../assets/icon/mine_32.png';
import icon_sudoku_l from '../../../assets/icon/sudoku_32.png';
import './Launcher.css';

const launcherItems: LauncherItem[] = [
  {
    id: 'theme',
    display: 'System Theme',
    iconUrl: icon_theme_l,
    template: themeEditorWindow
  },
  {
    id: 'dlab',
    display: 'DitherLab',
    iconUrl: icon_dlab_l,
    template: ditherLabWindow
  },
  {
    id: 'help',
    display: 'Help',
    iconUrl: icon_help_l,
    template: helpWindow
  },
  {
    id: 'mine',
    display: 'Minesweeper',
    iconUrl: icon_mine_l,
    template: minesweeperWindow
  },
  {
    id: 'sudoku',
    display: 'Sudoku',
    iconUrl: icon_sudoku_l,
    template: sudokuWindow
  }
];

function Launcher() {
  const dispatch = useAppDispatch();

  return (
    <div className='launch-root bevel content'>
      {launcherItems.map(item => (
        <div key={item.id} className='launch-item'
          onDoubleClick={() => dispatch(createWindow(item.template))}>

          <img src={item.iconUrl || ''} alt={item.id} className='launch-icon' />
          <div className='launch-label'>{item.display}</div>
        </div>
      ))}
    </div>
  );
}

export default Launcher;
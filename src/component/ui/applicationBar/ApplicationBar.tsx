import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks';
import { Menu } from '../menu/Menu.props';

import MenuBar from '../menuBar/MenuBar';
import ditherLabWindow from '../window/templates/DitherLab.window';
import helpWindow from '../window/templates/Help.window';
import launcherWindow from '../window/templates/Launcher.window';
import minesweeperWindow from '../window/templates/Minesweeper.window';
import sudokuWindow from '../window/templates/Sudoku.window';
import themeEditorWindow from '../window/templates/ThemeEditor.window';
import { WindowTemplate } from '../window/Window.props';
import { createWindow, focusWindow, selectActiveWindow, selectWindows } from '../windowManager/windowSlice';

import './ApplicationBar.css';

const applications: { [key: string]: WindowTemplate } = {
  launcher: launcherWindow,
  theme: themeEditorWindow,
  dlab: ditherLabWindow,
  help: helpWindow,
  mine: minesweeperWindow,
  sudoku: sudokuWindow
};

function ApplicationBar() {
  const windows = useSelector(selectWindows);
  const active = useSelector(selectActiveWindow);
  const dispatch = useAppDispatch();

  const applicationMenuItem = (id: string) => ({
    id: id,
    name: applications[id].title,
    iconUrl: applications[id].iconUrl
  });

  const menus: Menu[] = [
    {
      id: 'applications',
      name: 'Applications',
      items: [
        applicationMenuItem('launcher'),
        applicationMenuItem('theme'),
        applicationMenuItem('help'),
        '---',
        applicationMenuItem('dlab'),
        {
          id: 'games',
          name: 'Games',
          items: [
            applicationMenuItem('mine'),
            applicationMenuItem('sudoku')
          ]
        }
      ]
    },
    {
      id: 'windows',
      name: 'Windows',
      items: windows.windows
        .map(win => ({
          id: win.id.toString(),
          name: win.title,
          checkIf: { prop: 'active', value: win.id.toString() }
        }))
    }
  ];

  const menuHandler = (cmd: string) => {
    if (cmd.startsWith('windows')) {
      const id = parseInt(cmd.split('/')[1]);
      dispatch(focusWindow(id));
    } else if (cmd.startsWith('applications')) {
      const parts = cmd.split('/');
      const id = parts[parts.length - 1];

      dispatch(createWindow(applications[id]));
    }
  };

  console.log(active);
  return (
    <div className='appbar-root bevel'>
      <span className='appbar-os-name'>DitherOS</span>
      <hr className='bevel divider vertical' />
      <MenuBar menus={menus} onSelect={menuHandler}
        data={{ active: active?.id.toString() || '0' }} />
    </div>
  );
};

export default ApplicationBar;
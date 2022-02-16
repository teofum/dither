import React from 'react';
import LauncherItem from './LauncherItem';
import themeEditorWindow from '../themeEditor/ThemeEditor.window';
import ditherLabWindow from '../ditherLab/DitherLab.window';
import helpWindow from '../help/Help.window';

import { useAppDispatch } from '../../../hooks';
import { createWindow } from '../../ui/windowManager/windowSlice';

import icon_generic_l from '../../../assets/icon/app-generic_48.png';
import icon_theme_l from '../../../assets/icon/theme_48.png';
import icon_help_l from '../../../assets/icon/help_48.png';
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
    iconUrl: icon_generic_l,
    template: ditherLabWindow
  },
  {
    id: 'help',
    display: 'Help',
    iconUrl: icon_help_l,
    template: helpWindow
  }
];

function Launcher() {
  const dispatch = useAppDispatch();

  return (
    <div className='launch-root bevel content'>
      {launcherItems.map(item => (
        <div key={item.id} className='launch-item'
          onDoubleClick={() => dispatch(createWindow(item.template))}>

          <img src={item.iconUrl || icon_generic_l} alt={item.id} className='launch-icon' />
          <div className='launch-label'>{item.display}</div>
        </div>
      ))}
    </div>
  );
}

export default Launcher;
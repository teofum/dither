import React from 'react';
import LauncherProps from './Launcher.props';
import LauncherItem from './LauncherItem';
import themeEditorWindow from '../themeEditor/ThemeEditor.window';
import ditherLabWindow from '../ditherLab/DitherLab.window';

import icon_generic_l from '../../../assets/icon/app-generic_48.png';
import icon_theme_l from '../../../assets/icon/theme_48.png';
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
  }
];

function Launcher(props: LauncherProps) {
  return (
    <div className='launch-root bevel content'>
      {launcherItems.map((item, i) => (
        <div key={i} className='launch-item'
          onDoubleClick={() => props.onLaunch(item.template)}>

          <img src={item.iconUrl || icon_generic_l} alt={item.id} className='launch-icon' />
          <div className='launch-label'>{item.display}</div>
        </div>
      ))}
    </div>
  );
}

export default Launcher;
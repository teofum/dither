import React from 'react';
import { WindowTemplate } from '../../ui/window/Window.props';
import Launcher from './Launcher';
import LauncherProps from './Launcher.props';

import icon_computer from '../../../assets/icon/computer_16.png';

const launcherWindow = (props: LauncherProps): WindowTemplate => ({
  title: 'Program Manager',
  minWidth: 480,
  minHeight: 320,
  iconUrl: icon_computer,
  children: (<Launcher onLaunch={props.onLaunch}/>)
});

export default launcherWindow;
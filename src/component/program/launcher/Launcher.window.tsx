import React from 'react';
import { WindowTemplate } from '../../ui/window/Window.props';
import Launcher from './Launcher';

import icon_computer from '../../../assets/icon/computer_16.png';

const launcherWindow: WindowTemplate = {
  title: 'Program Manager',
  minWidth: 480,
  minHeight: 320,
  iconUrl: icon_computer,
  children: (<Launcher />)
};

export default launcherWindow;
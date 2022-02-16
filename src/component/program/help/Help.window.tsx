import React from 'react';
import { WindowTemplate } from '../../ui/window/Window.props';

import icon_help from '../../../assets/icon/help_16.png';
import Help from './Help';

const helpWindow: WindowTemplate = {
  title: 'Help',
  minWidth: 480,
  minHeight: 480,
  width: 640,
  height: 540,
  iconUrl: icon_help,
  children: (<Help />)
};

export default helpWindow;
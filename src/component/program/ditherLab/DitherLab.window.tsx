import React from 'react';
import DitherLab from './DitherLab';
import { WindowTemplate } from '../../ui/window/Window.props';

import icon_computer from '../../../assets/icon/computer_16.png';

const ditherLabWindow: WindowTemplate = {
  title: 'DitherLab',
  minWidth: 960,
  minHeight: 720,
  iconUrl: icon_computer,
  children: (<DitherLab />)
};

export default ditherLabWindow;
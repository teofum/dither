import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_computer from '../../../../assets/icon/computer_16.png';

const ditherLabWindow: WindowTemplate = {
  title: 'DitherLab',
  minWidth: 960,
  minHeight: 720,
  iconUrl: icon_computer,
  content: WindowContent.DitherLab
};

export default ditherLabWindow;
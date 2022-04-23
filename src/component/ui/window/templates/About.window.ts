import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_computer from '../../../../assets/icon/computer_16.png';

const aboutWindow: WindowTemplate = {
  title: 'About DitherOS',
  minWidth: 400,
  minHeight: 400,
  resizeable: false,
  maximizable: false,
  iconUrl: icon_computer,
  content: WindowContent.About
};

export default aboutWindow;
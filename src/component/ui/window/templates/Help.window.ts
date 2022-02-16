import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_help from '../../../../assets/icon/help_16.png';

const helpWindow: WindowTemplate = {
  title: 'Help',
  minWidth: 480,
  minHeight: 480,
  width: 640,
  height: 540,
  iconUrl: icon_help,
  content: WindowContent.Help
};

export default helpWindow;
import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_computer from '../../../../assets/icon/computer_16.png';

const launcherWindow: WindowTemplate = {
  title: 'Program Manager',
  minWidth: 480,
  minHeight: 320,
  iconUrl: icon_computer,
  content: WindowContent.Launcher
};

export default launcherWindow;
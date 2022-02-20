import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_help from '../../../../assets/icon/help_16.png';

export const createHelpWindow = (path?: string): WindowTemplate => ({
  title: 'Help',
  minWidth: 540,
  minHeight: 480,
  width: 680,
  height: 540,
  iconUrl: icon_help,
  content: WindowContent.Help,
  contentProps: { path }
});

const helpWindow = createHelpWindow();

export default helpWindow;
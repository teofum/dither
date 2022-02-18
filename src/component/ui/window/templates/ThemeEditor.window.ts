import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_theme from '../../../../assets/icon/theme_16.png';

const themeEditorWindow: WindowTemplate = {
  title: 'System Theme',
  minWidth: 440,
  minHeight: 400,
  maxWidth: 440,
  iconUrl: icon_theme,
  autoSize: true,
  maximizable: false,
  content: WindowContent.ThemeEditor
};

export default themeEditorWindow;
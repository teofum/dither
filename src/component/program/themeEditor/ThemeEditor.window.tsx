import React from 'react';
import { WindowTemplate } from '../../ui/window/Window.props';
import ThemeEditor from './ThemeEditor';

import icon_theme from '../../../assets/icon/theme_16.png';

const themeEditorWindow: WindowTemplate = {
  title: 'System Theme',
  minWidth: 440,
  minHeight: 400,
  maxWidth: 440,
  iconUrl: icon_theme,
  autoSize: true,
  maximizable: false,
  children: (<ThemeEditor />)
};

export default themeEditorWindow;
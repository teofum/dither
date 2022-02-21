import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_dlab from '../../../../assets/icon/dlab_16.png';

const ditherLabWindow: WindowTemplate = {
  title: 'DitherLab',
  minWidth: 960,
  minHeight: 720,
  iconUrl: icon_dlab,
  content: WindowContent.DitherLab
};

export default ditherLabWindow;
import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_mine from '../../../../assets/icon/mine_16.png';

const minesweeperWindow: WindowTemplate = {
  title: 'Minesweeper',
  minWidth: 400,
  minHeight: 400,
  iconUrl: icon_mine,
  autoSize: true,
  maximizable: false,
  content: WindowContent.Minesweeper
};

export default minesweeperWindow;
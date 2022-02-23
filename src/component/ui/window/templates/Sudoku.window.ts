import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_mine from '../../../../assets/icon/mine_16.png';

const sudokuWindow: WindowTemplate = {
  title: 'Sudoku',
  minWidth: 400,
  minHeight: 400,
  iconUrl: icon_mine,
  autoSize: true,
  maximizable: false,
  content: WindowContent.Sudoku
};

export default sudokuWindow;
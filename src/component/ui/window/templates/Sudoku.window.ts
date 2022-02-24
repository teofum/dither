import { WindowTemplate } from '../Window.props';
import WindowContent from '../WindowContent';

import icon_sudoku from '../../../../assets/icon/sudoku_16.png';

const sudokuWindow: WindowTemplate = {
  title: 'Sudoku',
  minWidth: 400,
  minHeight: 400,
  iconUrl: icon_sudoku,
  autoSize: true,
  maximizable: false,
  content: WindowContent.Sudoku
};

export default sudokuWindow;
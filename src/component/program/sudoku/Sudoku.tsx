import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks';
import MenuBar from '../../ui/menuBar/MenuBar';
import { destroyWindow } from '../../ui/windowManager/windowSlice';
import ProgramProps from '../ProgramProps';
import sudokuMenus from './Sudoku.menu';
import './Sudoku.css';
import classlist from '../../../utils/etc/classlist';
import newBoard, { checkBoard, SudokuBoard, SudokuCell } from './Sudoku.game';

const skDifficulty = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
};

function Sudoku(props: ProgramProps) {
  const [difficulty, setDifficulty] = useState(skDifficulty.easy);
  const [board, setBoard] = useState<SudokuBoard>();
  const [selected, setSelected] = useState<number>();
  const [win, setWin] = useState(false);
  const globalDispatch = useAppDispatch();

  useEffect(() => {
    if (board && checkBoard(board))
      winGame();
  }, [board]);

  useEffect(() => {
    setWin(false);
    newBoard(difficulty).then(b => setBoard(b));
  }, [difficulty]);

  const menuHandler = (cmd: string) => {
    switch (cmd) {
      case 'game/new':
        setWin(false);
        newBoard(difficulty).then(b => setBoard(b));
        break;
      case 'game/easy':
        setDifficulty(skDifficulty.easy);
        break;
      case 'game/medium':
        setDifficulty(skDifficulty.medium);
        break;
      case 'game/hard':
        setDifficulty(skDifficulty.hard);
        break;
      case 'game/exit':
        globalDispatch(destroyWindow(props.windowId));
        break;
    }
  };

  const menuData = {
    'game/difficulty': difficulty
  };

  const winGame = () => {
    setWin(true);
    setSelected(undefined);
  };

  const getCell = (cell: SudokuCell, i: number) => {
    const x = i % 9;
    const y = ~~(i / 9);
    const block = ~~(x / 3) + 3 * ~~(y / 3);

    const nosel = selected === undefined;
    const sx = nosel ? -1 : (selected) % 9;
    const sy = nosel ? -1 : ~~((selected) / 9);
    const sblock = nosel ? -1 : ~~(sx / 3) + 3 * ~~(sy / 3);

    const highlight = i !== selected &&
      (x === sx || y === sy || block === sblock);

    const conflict = selected && highlight && cell.value &&
      cell.value === board?.cells[selected].value;

    return (
      <div key={`cell_${i}`}
        className={
          classlist(
            'sudoku-cell',
            i === selected ? 'sudoku-selected' : '',
            highlight ? 'sudoku-highlight' : '',
            conflict ? 'sudoku-conflict' : '',
            cell.fixed ? 'sudoku-fixed' : ''
          )}
        onClick={() => setSelected(i)}>
        <span>{cell.value || ''}</span>

        {!cell.value &&
          <div className="sudoku-annotations">
            {cell.annotations.map((a, i) => (
              <span key={`a_${i}`}>
                {a ? i + 1 : ''}
              </span>
            ))}
          </div>}
      </div>
    );
  };

  const kbCapture = (ev: Event) => {
    if (!board || win || selected === undefined) return;

    const kev = ev as KeyboardEvent;
    kev.preventDefault();

    // Handle movement
    if (kev.code.startsWith('Arrow')) {
      let sx = (selected) % 9;
      let sy = ~~((selected) / 9);

      switch (kev.code.substring(5)) {
        case 'Up':
          sy -= (kev.ctrlKey ? 3 : 1);
          if (sy < 0) sy += 9;
          break;
        case 'Down':
          sy += (kev.ctrlKey ? 3 : 1);
          if (sy > 8) sy -= 9;
          break;
        case 'Left':
          sx -= (kev.ctrlKey ? 3 : 1);
          if (sx < 0) sx += 9;
          break;
        case 'Right':
          sx += (kev.ctrlKey ? 3 : 1);
          if (sx > 8) sx -= 9;
          break;
      }

      setSelected(sy * 9 + sx);
      return;
    }

    const newBoard = { cells: board.cells.slice() };
    const sl = newBoard.cells[selected];
    if (sl.fixed) return; // Fixed cells cannot be modified

    if (kev.code === 'Backspace') {
      sl.annotations = Array.from(Array(9), () => false);
      sl.value = 0;
    } else {
      let matchNum = false;
      let val = 0;
      if (kev.code.match(/Digit[0-9]/g)) {
        matchNum = true;
        val = parseInt(kev.code.substring(5));
      } else if (kev.code.match(/Numpad[0-9]/g)) {
        matchNum = true;
        val = parseInt(kev.code.substring(6));
      }

      if (matchNum) {
        if (kev.ctrlKey) {
          if (val === 0) sl.annotations = Array.from(Array(9), () => false);
          else sl.annotations[val - 1] = !sl.annotations[val - 1];
        }
        else sl.value = val;
      }
    }

    setBoard(newBoard);
  };

  return (
    <div className='sudoku-root' tabIndex={99999}
      onKeyDown={e => kbCapture(e.nativeEvent)}>
      <div className='sudoku-menu-bar'>
        <MenuBar menus={sudokuMenus} data={menuData}
          onSelect={menuHandler} />
      </div>

      <div className={
        classlist(
          'sudoku-content',
          win ? 'sudoku-won' : ''
        )}>
        <div className='sudoku-board bevel content'>
          {board?.cells.map(getCell)}
        </div>
      </div>
    </div>
  );
}

export default Sudoku;
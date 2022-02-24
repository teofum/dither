import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAppDispatch } from '../../../hooks';
import { destroyWindow } from '../../ui/windowManager/windowSlice';
import MenuBar from '../../ui/menuBar/MenuBar';
import ProgramProps from '../ProgramProps';
import sudokuMenus from './Sudoku.menu';
import newBoard, { checkBoard, SudokuBoard, SudokuCell } from './Sudoku.game';
import classlist from '../../../utils/etc/classlist';

import sk_help from './assets/help.md?raw';
import './Sudoku.css';

const skDifficulty = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard'
};

const skConfig = {
  annotations: true,
  highlight: true,
  warnings: true,
  mouse: true
};

enum SKGameState {
  New = 'new',
  Playing = 'playing',
  Won = 'won'
}

function Sudoku(props: ProgramProps) {
  const [board, setBoard] = useState<SudokuBoard>();
  const [selected, setSelected] = useState<number>();
  const [gameState, setGameState] = useState(SKGameState.New);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState<number>();

  const [difficulty, setDifficulty] = useState(skDifficulty.easy);
  const [config, setConfig] = useState(skConfig);
  const [showHelp, setShowHelp] = useState(true);

  const globalDispatch = useAppDispatch();

  useEffect(() => {
    if (board && checkBoard(board))
      winGame();
  }, [board]);

  useEffect(() => {
    setGameState(SKGameState.New);
    newBoard(difficulty).then(b => setBoard(b));
  }, [difficulty]);

  useEffect(() => {
    if (timer) clearInterval(timer);

    if (gameState === SKGameState.New)
      setTime(0);
    else if (gameState === SKGameState.Playing) {
      setTime(0);

      const newTimer = setInterval(() => {
        setTime(time => Math.min(time + 1, 9999));
      }, 1000);
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    }
  }, [gameState]);

  const menuHandler = (cmd: string) => {
    switch (cmd) {
      case 'game/new':
        setGameState(SKGameState.New);
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
      case 'game/mouse':
        setConfig({ ...config, mouse: !config.mouse });
        break;
      case 'view/annotations':
        setConfig({ ...config, annotations: !config.annotations });
        break;
      case 'view/highlight':
        setConfig({ ...config, highlight: !config.highlight });
        break;
      case 'view/warnings':
        setConfig({ ...config, warnings: !config.warnings });
        break;
      case 'help/controls':
        setShowHelp(true);
        break;
      case 'game/exit':
        globalDispatch(destroyWindow(props.windowId));
        break;
    }
  };

  const menuData = {
    'game/difficulty': difficulty,
    'game/mouse': `${config.mouse}`,
    'view/annotations': `${config.annotations}`,
    'view/highlight': `${config.highlight}`,
    'view/warnings': `${config.warnings}`
  };

  const winGame = () => {
    setGameState(SKGameState.Won);
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
            (config.highlight && highlight) ? 'sudoku-highlight' : '',
            (config.warnings && conflict) ? 'sudoku-conflict' : '',
            cell.fixed ? 'sudoku-fixed' : ''
          )}
        onClick={e => clickHandler(e.nativeEvent, i)}
        onContextMenu={e => clickHandler(e.nativeEvent, i, true)}>
        <span>{cell.value || ''}</span>

        {config.annotations && !cell.value &&
          <div className='sudoku-annotations'>
            {cell.annotations.map((a, i) => (
              <span key={`a_${i}`}>
                {a ? i + 1 : ''}
              </span>
            ))}
          </div>}
      </div>
    );
  };

  const clickHandler = (ev: Event, i: number, rclick: boolean = false) => {
    if (!board) return;
    ev.preventDefault();

    if (gameState === SKGameState.New)
      setGameState(SKGameState.Playing);

    if (i !== selected) {
      setSelected(i);
    } else if (config.mouse) {
      const newBoard = { cells: board.cells.slice() };
      const sl = newBoard.cells[selected];
      if (sl.fixed) return; // Fixed cells cannot be modified

      sl.value = (sl.value + (rclick ? -1 : 1));
      if (sl.value > 9) sl.value -= 10;
      if (sl.value < 0) sl.value += 10;
      setBoard(newBoard);
    }
  };

  const kbCapture = (ev: Event) => {
    if (!board || selected === undefined) return;
    if (gameState === SKGameState.Won) return;

    const kev = ev as KeyboardEvent;
    kev.preventDefault();
    
    if (gameState === SKGameState.New)
      setGameState(SKGameState.Playing);

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
          gameState === SKGameState.Won ? 'sudoku-won' : ''
        )}>
        <div className='sudoku-board bevel content'>
          {board?.cells.map(getCell) ||
            <div className='sudoku-placeholder'>
              Loading game...
            </div>}

          {showHelp &&
            <div className='sudoku-help'>
              <ReactMarkdown>
                {sk_help}
              </ReactMarkdown>

              <button className='bevel'
                onClick={() => setShowHelp(false)}>
                Start Game
              </button>
            </div>}
        </div>
      </div>

      <div className='sudoku-status-bar'>
        <div className='bevel inset light'>{gameState === SKGameState.Won ? 'COMPLETED' : ''}</div>
        <div className='bevel inset light'>Time: {time}</div>
        <div className='bevel inset light'>Difficulty: {difficulty.toUpperCase()}</div>
      </div>
    </div>
  );
}

export default Sudoku;
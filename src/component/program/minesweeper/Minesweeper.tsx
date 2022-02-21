import React, { useEffect, useState } from 'react';
import MenuBar from '../../ui/menuBar/MenuBar';
import mineMenus from './Minesweeper.menu';
import MinesweeperDisplay from './display/MinesweeperDisplay';
import classlist from '../../../utils/etc/classlist';

import ms_mine from '../../../assets/ui/mine/mine.png';
import ms_flag from '../../../assets/ui/mine/flag.png';
import ms_question from '../../../assets/ui/mine/flag-question.png';
import ms_wrong from '../../../assets/ui/mine/wrong.png';
import ms_smiley from '../../../assets/ui/mine/smiley.png';
import ms_smiley_dead from '../../../assets/ui/mine/smiley-dead.png';
import ms_smiley_win from '../../../assets/ui/mine/smiley-win.png';
import ms_smiley_click from '../../../assets/ui/mine/smiley-click.png';
import './Minesweeper.css';
import ProgramProps from '../ProgramProps';
import { useAppDispatch } from '../../../hooks';
import { destroyWindow } from '../../ui/windowManager/windowSlice';

enum MineGameState {
  New = 'new',
  Playing = 'playing',
  Won = 'won',
  Lost = 'lost'
}

enum MineFlagStatus {
  None,
  Flagged,
  QuestionMark
}

interface MinesweeperCell {
  hasMine: boolean;
  nearMines: number;
  flag: MineFlagStatus;
  revealed: boolean;
  exploded: boolean;
}

interface MinesweeperBoard {
  cells: MinesweeperCell[];
  width: number;
  height: number;
}

interface MinesweeperSettings {
  width: number;
  height: number;
  mines: number;
}

const msDifficultyPresets: { [key: string]: MinesweeperSettings } = {
  beginner: { width: 8, height: 8, mines: 10 },
  intermediate: { width: 16, height: 16, mines: 40 },
  expert: { width: 30, height: 16, mines: 99 }
};

const emptyCell = (): MinesweeperCell => ({
  hasMine: false,
  nearMines: 0,
  flag: MineFlagStatus.None,
  revealed: false,
  exploded: false
});

const emptyBoard = (w: number, h: number): MinesweeperBoard => {
  return {
    cells: Array.from(Array(w * h), emptyCell),
    width: w,
    height: h
  };
};

const neighbors = (x0: number, y0: number, board: MinesweeperBoard) => {
  const n: MinesweeperCell[] = [];
  for (let y = y0 - 1; y <= y0 + 1; y++)
    for (let x = x0 - 1; x <= x0 + 1; x++)
      if (x >= 0 && x < board.width && y >= 0 && y < board.height)
        n.push(board.cells[x + board.width * y]);

  return n;
};

const newBoard = (settings: MinesweeperSettings) => {
  const { width, height, mines } = settings;
  const board = emptyBoard(width, height);
  const size = width * height;

  // Place mines
  let placed = 0;
  while (placed < mines) {
    const index = Math.floor(Math.random() * size);
    const cell = board.cells[index];
    if (!cell.hasMine) {
      cell.hasMine = true;
      placed++;
    }
  }

  // Calculate # of nearby mines for each cell
  for (let y = 0; y < board.height; y++)
    for (let x = 0; x < board.width; x++) {
      const cell = board.cells[x + board.width * y];

      cell.nearMines = neighbors(x, y, board)
        .filter(nb => nb.hasMine)
        .length;
    }

  return board;
};

function Minesweeper(props: ProgramProps) {
  const globalDispatch = useAppDispatch();

  const [settings, setSettings] = useState(msDifficultyPresets.beginner);
  const [board, setBoard] = useState<MinesweeperBoard>();
  const [gameState, setGameState] = useState(MineGameState.New);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState<number>();

  useEffect(() => {
    if (timer) clearInterval(timer);

    if (gameState === MineGameState.New)
      setTime(0);
    else if (gameState === MineGameState.Playing) {
      setTime(0);

      const newTimer = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    }
  }, [gameState]);

  const reset = () => {
    setBoard(newBoard(settings));
    setGameState(MineGameState.New);
  };

  const startGame = () => {
    setGameState(MineGameState.Playing);
  };

  const winGame = () => {
    setGameState(MineGameState.Won);
  };

  const loseGame = () => {
    setGameState(MineGameState.Lost);
  };

  const menuHandler = (cmd: string) => {
    switch (cmd) {
      case 'game/new':
        reset();
        break;
      case 'game/beginner':
        setSettings(msDifficultyPresets.beginner);
        break;
      case 'game/intermediate':
        setSettings(msDifficultyPresets.intermediate);
        break;
      case 'game/expert':
        setSettings(msDifficultyPresets.expert);
        break;
      case 'game/exit':
        globalDispatch(destroyWindow(props.windowId));
        break;
    }
  };

  useEffect(reset, [settings]);

  const reveal = (board: MinesweeperBoard, i: number) => {
    const cell = board.cells[i];
    if (cell.revealed) return;

    cell.revealed = true;

    if (cell.nearMines === 0 && !cell.hasMine) {
      const x = i % board.width;
      const y = ~~(i / board.width);

      neighbors(x, y, board).forEach(nb => {
        if (!nb.revealed && !nb.hasMine && nb.flag !== MineFlagStatus.Flagged) {
          const nbi = board.cells.indexOf(nb);
          reveal(board, nbi);
        }
      });
    }
  };

  const onCellClick = (i: number) => {
    if (!board) return;

    if (gameState === MineGameState.New)
      startGame();

    const newBoard = {
      ...board,
      cells: board.cells.slice()
    };
    const cell = newBoard.cells[i];
    if (cell.flag === MineFlagStatus.Flagged) return;

    reveal(newBoard, i);

    if (cell.hasMine) {
      // Kaboom
      loseGame();
      cell.exploded = true;

      // Reveal all mines and wrongly flagged cells
      newBoard.cells.forEach((c, ci) => {
        if ((c.hasMine && c.flag !== MineFlagStatus.Flagged)
          || (!c.hasMine && c.flag === MineFlagStatus.Flagged))
          reveal(board, ci);
      });
    } else {
      // Win state #1: all cells without mines revealed
      const win = newBoard.cells
        .filter(cell => !cell.revealed)
        .every(cell => cell.hasMine);

      if (win) winGame();
    }

    setBoard(newBoard);
  };

  const onCellRightClick = (ev: Event, i: number) => {
    ev.preventDefault();
    if (!board) return;

    if (gameState === MineGameState.New)
      startGame();

    const newBoard = {
      ...board,
      cells: board.cells.slice()
    };

    const cell = newBoard.cells[i];
    if (cell.revealed) return;

    cell.flag = (cell.flag + 1) % 3;

    // Win state #2: all mines correctly flagged
    const allMinesFlagged = newBoard.cells
      .filter(cell => cell.hasMine)
      .every(cell => cell.flag === MineFlagStatus.Flagged);

    const newFlagCount = newBoard.cells
      .filter(cell => cell.flag === MineFlagStatus.Flagged)
      .length;

    if (allMinesFlagged && newFlagCount === settings.mines)
      winGame();

    setBoard(newBoard);
  };

  const flagCount = board?.cells
    .filter(cell => cell.flag === MineFlagStatus.Flagged)
    .length;

  const playing = gameState === MineGameState.New || gameState === MineGameState.Playing;
  return (
    <div className='mine-root'>
      <div className='mine-menu-bar'>
        <MenuBar menus={mineMenus} onSelect={menuHandler} />
      </div>

      <div className='mine-content bevel'>
        <div className='mine-status-bar bevel light inset'>
          <MinesweeperDisplay value={settings.mines - (flagCount || 0)} />

          <button className='mine-reset-button bevel' onClick={reset}>
            {playing &&
              <img className='mine-smiley-normal' src={ms_smiley} alt=':)' />}

            {playing &&
              <img className='mine-smiley-click' src={ms_smiley_click} alt=':o' />}

            {gameState === MineGameState.Lost &&
              <img className='mine-smiley-dead' src={ms_smiley_dead} alt='X(' />}

            {gameState === MineGameState.Won &&
              <img className='mine-smiley-win' src={ms_smiley_win} alt='B)' />}
          </button>

          <MinesweeperDisplay value={time} />
        </div>

        <div className={
          classlist(
            'mine-game-area bevel content',
            `mine-game-state-${gameState}`
          )}
          style={{ gridTemplateColumns: `repeat(${board?.width}, auto)` }}>
          {board?.cells.map((cell, i) => (
            <div key={i} className={
              classlist(
                'mine-cell',
                cell.flag === MineFlagStatus.Flagged ? 'mine-cell-flagged' : '',
                cell.revealed ? 'mine-cell-revealed' : ''
              )}
              onClick={() => onCellClick(i)}
              onContextMenu={ev => onCellRightClick(ev.nativeEvent, i)}>
              <div className={
                classlist(
                  'mine-cell-content',
                  `mine-cell-near-${cell.nearMines}`,
                  cell.exploded ? 'mine-cell-exploded' : ''
                )}>
                {cell.hasMine ?
                  (<img src={ms_mine} alt='mine' />) :
                  (!cell.hasMine && cell.flag === MineFlagStatus.Flagged) ?
                    (<img src={ms_wrong} alt='wrong' />) :
                    (cell.nearMines || '')}
              </div>

              {!cell.revealed &&
                <div className='mine-cell-cover bevel bevel-alt'>
                  {cell.flag === MineFlagStatus.Flagged &&
                    <img src={ms_flag} alt='F' />}

                  {cell.flag === MineFlagStatus.QuestionMark &&
                    <img src={ms_question} alt='?' />}
                </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Minesweeper;
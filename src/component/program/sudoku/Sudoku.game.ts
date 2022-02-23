export interface SudokuCell {
  value: number;
  annotations: boolean[];
  fixed: boolean;
}

export interface SudokuBoard {
  cells: SudokuCell[];
}

const emptyCell = (): SudokuCell => ({
  value: 0,
  annotations: Array.from(Array(9), () => false),
  fixed: false
});

export const emptyBoard = (): SudokuBoard => ({
  cells: Array.from(Array(9 * 9), emptyCell)
});

/* const fillCells = (cells: SudokuCell[], i: number = 0): boolean => {
  const neighborValues = getNeighborValues(cells, i);

  // All values [1-9] not in any neighbor cell
  const options = Array.from(Array(9), (v, k) => k + 1)
    .filter(v => !neighborValues.has(v));

  shuffle(options); // Shuffle in place

  for (const option of options) {
    cells[i].value = option;

    if (i === cells.length - 1) return true;

    // Recursive step
    if (fillCells(cells, i + 1)) return true;
  };

  // Couldn't fill with any option, backtrack
  cells[i].value = 0;
  return false;
};

export const fullBoard = (): SudokuBoard => {
  const board = emptyBoard();

  if (!fillCells(board.cells))
    throw new Error('fullBoard: could not fill board');

  return board;
};

const solve = (cells: SudokuCell[], sl: { n: number } = { n: 0 }): boolean => {
  let i;

  for (i = 0; i < 81; i++) {
    if (cells[i].value === 0) {
      const neighborValues = getNeighborValues(cells, i);
      const options = Array.from(Array(9), (v, k) => k + 1)
        .filter(v => !neighborValues.has(v));

      for (const option of options) {
        cells[i].value = option;
        if (!cells.some(cell => cell.value === 0)) {
          sl.n = sl.n + 1;
          cells[i].value = 0;
          break;
        } else if (solve(cells, sl)) {
          return true;
        } else cells[i].value = 0;
      }

      break;
    }
  }

  return false;
};

const unsolve = (cells: SudokuCell[], rm: number): SudokuCell[] => {
  let removed = 0;
  let attempts = 20;

  while (attempts > 0 && removed < rm) {
    let i;
    do {
      i = ~~(Math.random() * 81);
    } while (cells[i].value === 0);

    const backup = cells[i].value;
    cells[i].value = 0;

    const solutions = { n: 0 };
    const clone = cells.map(cell => ({ ...cell }));
    solve(clone, solutions);

    if (solutions.n !== 1) {
      cells[i].value = backup;
      attempts--;
    } else removed++;
  }

  console.log(81 - removed);
  return cells;
}; */

const newBoard = async (difficulty: string) => {
  /* const start = Date.now();
  const board = fullBoard();
  board.cells = unsolve(board.cells, missing);
  board.cells.forEach(cell => cell.fixed = cell.value !== 0);
  console.log(`${Date.now() - start}ms`); */
  
  // This is way easier than generating the boards myself, lol
  return fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
    .then(res => res.json())
    .then(data => {
      const flat = (data.board as number[][]).flat(1);

      const board = emptyBoard();
      board.cells.forEach((cell, i) => {
        cell.value = flat[i];
        cell.fixed = cell.value !== 0;
      });
      return board;
    });
};

const getNeighborValues = (cells: SudokuCell[], i: number): Set<number> => {
  const x = i % 9;
  const y = ~~(i / 9);
  const bx = ~~(x / 3) * 3;
  const by = ~~(y / 3) * 3;

  const column = Array.from(Array(9), (v, k) => 9 * k + x);
  const row = Array.from(Array(9), (v, k) => 9 * y + k);
  const block = Array.from(Array(9), (v, k) => {
    const nx = bx + (k % 3);
    const ny = by + ~~(k / 3);
    return 9 * ny + nx;
  });

  const neigborIndices = [...column, ...row, ...block];
  return new Set(neigborIndices.map(i => cells[i].value));
};

export const checkBoard = (board: SudokuBoard): boolean => {
  return board.cells.every((cell, i) => {
    const otherCells = board.cells.map(c => ({ ...c }));
    otherCells[i].value = 0;
    return !getNeighborValues(otherCells, i).has(cell.value);
  });
};

export default newBoard;
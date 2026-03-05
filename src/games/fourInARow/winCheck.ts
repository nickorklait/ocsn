import { BoardState, CONNECT_COUNT, Player, CellCoord, COLUMNS, ROWS } from './utils';

const DIRECTIONS = [
  { dr: 0, dc: 1 },
  { dr: 1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
];

const isInside = (row: number, col: number): boolean =>
  row >= 0 && row < ROWS && col >= 0 && col < COLUMNS;

const collectDirection = (
  board: BoardState,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
): CellCoord[] => {
  const cells: CellCoord[] = [];
  let nextRow = row + dr;
  let nextCol = col + dc;

  while (isInside(nextRow, nextCol) && board[nextRow][nextCol] === player) {
    cells.push({ row: nextRow, col: nextCol });
    nextRow += dr;
    nextCol += dc;
  }

  return cells;
};

export const findWinningLine = (
  board: BoardState,
  row: number,
  col: number,
  player: Player
): CellCoord[] | null => {
  for (const direction of DIRECTIONS) {
    const forward = collectDirection(board, row, col, direction.dr, direction.dc, player);
    const backward = collectDirection(board, row, col, -direction.dr, -direction.dc, player);
    const line = [...backward.reverse(), { row, col }, ...forward];

    if (line.length >= CONNECT_COUNT) {
      const center = backward.length;
      const start = Math.max(0, center - (CONNECT_COUNT - 1));
      return line.slice(start, start + CONNECT_COUNT);
    }
  }

  return null;
};

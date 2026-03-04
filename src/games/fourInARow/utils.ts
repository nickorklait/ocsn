export const COLUMNS = 7;
export const ROWS = 6;
export const CONNECT_COUNT = 4;

export type Player = 1 | 2;
export type CellValue = Player | null;
export type BoardState = CellValue[][];

export type CellCoord = {
  row: number;
  col: number;
};

export const createEmptyBoard = (): BoardState =>
  Array.from({ length: ROWS }, () => Array.from({ length: COLUMNS }, () => null));

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const getDropRow = (board: BoardState, col: number): number => {
  if (col < 0 || col >= COLUMNS) {
    return -1;
  }
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return -1;
};

export const isBoardFull = (board: BoardState): boolean =>
  board.every((row) => row.every((cell) => cell !== null));

export const cloneBoard = (board: BoardState): BoardState => board.map((row) => [...row]);

export type Mark = 'O' | 'X';
export type CellValue = Mark | null;

export type BoardState = CellValue[];

export type RoundOutcome = {
  winner: Mark | null;
  winningLine: number[] | null;
  isDraw: boolean;
};

export const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const createEmptyBoard = (): BoardState => Array.from({ length: 9 }, () => null);

export const getRoundOutcome = (board: BoardState): RoundOutcome => {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const first = board[a];
    if (first && first === board[b] && first === board[c]) {
      return {
        winner: first,
        winningLine: line,
        isDraw: false,
      };
    }
  }

  const isDraw = board.every((cell) => cell !== null);
  return {
    winner: null,
    winningLine: null,
    isDraw,
  };
};

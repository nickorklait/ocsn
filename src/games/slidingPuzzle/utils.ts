export const GRID_SIZE = 3;
export const EMPTY_TILE = GRID_SIZE * GRID_SIZE - 1;

export const createSolvedBoard = (size: number = GRID_SIZE): number[] =>
  Array.from({ length: size * size }, (_, index) => index);

const countInversions = (tiles: number[]): number => {
  let inversions = 0;
  for (let i = 0; i < tiles.length; i += 1) {
    if (tiles[i] === EMPTY_TILE) {
      continue;
    }
    for (let j = i + 1; j < tiles.length; j += 1) {
      if (tiles[j] === EMPTY_TILE) {
        continue;
      }
      if (tiles[i] > tiles[j]) {
        inversions += 1;
      }
    }
  }
  return inversions;
};

const isSolvable = (tiles: number[], size: number): boolean => {
  const inversions = countInversions(tiles);
  if (size % 2 !== 0) {
    return inversions % 2 === 0;
  }

  const emptyIndex = tiles.indexOf(EMPTY_TILE);
  const emptyRowFromBottom = size - Math.floor(emptyIndex / size);
  const isEmptyRowFromBottomEven = emptyRowFromBottom % 2 === 0;
  const isInversionsEven = inversions % 2 === 0;
  return isEmptyRowFromBottomEven ? !isInversionsEven : isInversionsEven;
};

const shuffleArray = (source: number[]): number[] => {
  const next = [...source];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const generateShuffledBoard = (size: number = GRID_SIZE): number[] => {
  const solved = createSolvedBoard(size);
  let shuffled = solved;

  do {
    shuffled = shuffleArray(solved);
  } while (!isSolvable(shuffled, size) || isSolved(shuffled));

  return shuffled;
};

export const isSolved = (board: number[]): boolean =>
  board.every((tile, index) => tile === index);

export const getEmptyIndex = (board: number[]): number => board.indexOf(EMPTY_TILE);

export const canMoveTile = (board: number[], position: number, size: number = GRID_SIZE): boolean => {
  const empty = getEmptyIndex(board);
  const row = Math.floor(position / size);
  const col = position % size;
  const emptyRow = Math.floor(empty / size);
  const emptyCol = empty % size;
  return Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
};

export const moveTile = (board: number[], position: number, size: number = GRID_SIZE): number[] => {
  if (!canMoveTile(board, position, size)) {
    return board;
  }
  const next = [...board];
  const empty = getEmptyIndex(next);
  [next[position], next[empty]] = [next[empty], next[position]];
  return next;
};

import { useCallback, useRef, useState } from 'react';
import {
  createSolvedBoard,
  generateShuffledBoard,
  GRID_SIZE,
  isSolved,
  moveTile,
} from './utils';

export const useSlidingPuzzle = (size: number = GRID_SIZE) => {
  const initialBoardRef = useRef<number[]>(createSolvedBoard(size));
  const [board, setBoard] = useState<number[]>(() => {
    const shuffled = generateShuffledBoard(size);
    initialBoardRef.current = shuffled;
    return shuffled;
  });
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const handleTilePress = useCallback(
    (position: number) => {
      if (solved) {
        return;
      }
      setBoard((prev) => {
        const next = moveTile(prev, position, size);
        if (next === prev) {
          return prev;
        }
        setMoves((count) => count + 1);
        setSolved(isSolved(next));
        return next;
      });
    },
    [size, solved]
  );

  const shuffle = useCallback(() => {
    const shuffled = generateShuffledBoard(size);
    initialBoardRef.current = shuffled;
    setBoard(shuffled);
    setMoves(0);
    setSolved(false);
  }, [size]);

  const reset = useCallback(() => {
    setBoard(initialBoardRef.current);
    setMoves(0);
    setSolved(false);
  }, []);

  return {
    board,
    moves,
    solved,
    handleTilePress,
    shuffle,
    reset,
  };
};

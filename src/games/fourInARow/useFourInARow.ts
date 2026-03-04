import { useCallback, useEffect, useRef, useState } from 'react';
import { findWinningLine } from './winCheck';
import { BoardState, CellCoord, Player, cloneBoard, createEmptyBoard, getDropRow, isBoardFull } from './utils';

type MatchStatus = 'idle' | 'playing' | 'won' | 'draw';

type Score = {
  p1: number;
  p2: number;
};

export const useFourInARow = () => {
  const [board, setBoard] = useState<BoardState>(() => createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [status, setStatus] = useState<MatchStatus>('idle');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningCells, setWinningCells] = useState<CellCoord[]>([]);
  const [score, setScore] = useState<Score>({ p1: 0, p2: 0 });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      return;
    }
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) {
        return;
      }
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 250);
  }, []);

  const restartRound = useCallback(() => {
    stopTimer();
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setStatus('idle');
    setWinner(null);
    setWinningCells([]);
    setElapsedSeconds(0);
    startTimeRef.current = null;
  }, [stopTimer]);

  const resetMatch = useCallback(() => {
    restartRound();
    setScore({ p1: 0, p2: 0 });
  }, [restartRound]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const dropInColumn = useCallback(
    (col: number) => {
      if (status === 'won' || status === 'draw') {
        return;
      }

      setBoard((prev) => {
        const row = getDropRow(prev, col);
        if (row < 0) {
          return prev;
        }

        if (status === 'idle') {
          setStatus('playing');
          startTimer();
        }

        const next = cloneBoard(prev);
        next[row][col] = currentPlayer;

        const winningLine = findWinningLine(next, row, col, currentPlayer);
        if (winningLine) {
          setStatus('won');
          setWinner(currentPlayer);
          setWinningCells(winningLine);
          stopTimer();
          setScore((prevScore) =>
            currentPlayer === 1
              ? { ...prevScore, p1: prevScore.p1 + 1 }
              : { ...prevScore, p2: prevScore.p2 + 1 }
          );
          return next;
        }

        if (isBoardFull(next)) {
          setStatus('draw');
          stopTimer();
          return next;
        }

        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        return next;
      });
    },
    [currentPlayer, startTimer, status, stopTimer]
  );

  return {
    board,
    currentPlayer,
    status,
    winner,
    winningCells,
    score,
    elapsedSeconds,
    dropInColumn,
    restartRound,
    resetMatch,
  };
};

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BoardState, Mark, createEmptyBoard, getRoundOutcome } from './utils';

type Score = {
  playerWins: number;
  computerWins: number;
  draws: number;
};

const chooseComputerMove = (board: BoardState, computerMark: Mark, playerMark: Mark): number => {
  const open = board
    .map((value, index) => ({ value, index }))
    .filter((item) => item.value === null)
    .map((item) => item.index);

  if (open.length === 0) {
    return -1;
  }

  for (const index of open) {
    const next = [...board];
    next[index] = computerMark;
    if (getRoundOutcome(next).winner === computerMark) {
      return index;
    }
  }

  for (const index of open) {
    const next = [...board];
    next[index] = playerMark;
    if (getRoundOutcome(next).winner === playerMark) {
      return index;
    }
  }

  if (open.includes(4)) {
    return 4;
  }

  const corners = open.filter((index) => [0, 2, 6, 8].includes(index));
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return open[Math.floor(Math.random() * open.length)];
};

export const useTicTacToe = () => {
  const [board, setBoard] = useState<BoardState>(() => createEmptyBoard());
  const [playerMark, setPlayerMark] = useState<Mark>('O');
  const [currentTurn, setCurrentTurn] = useState<Mark>('O');
  const [score, setScore] = useState<Score>({ playerWins: 0, computerWins: 0, draws: 0 });
  const [roundFinished, setRoundFinished] = useState(false);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const outcome = useMemo(() => getRoundOutcome(board), [board]);
  const computerMark: Mark = playerMark === 'O' ? 'X' : 'O';
  const isComputerTurn = !roundFinished && currentTurn === computerMark;

  const clearAiTimer = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
      aiTimeoutRef.current = null;
    }
  }, []);

  const applyMove = useCallback(
    (index: number, mark: Mark) => {
      if (roundFinished || board[index] !== null) {
        return;
      }

      const next = [...board];
      next[index] = mark;
      setBoard(next);

      const result = getRoundOutcome(next);
      if (result.winner) {
        setRoundFinished(true);
        setScore((prev) =>
          result.winner === playerMark
            ? { ...prev, playerWins: prev.playerWins + 1 }
            : { ...prev, computerWins: prev.computerWins + 1 }
        );
        return;
      }
      if (result.isDraw) {
        setRoundFinished(true);
        setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
        return;
      }

      setCurrentTurn(mark === 'O' ? 'X' : 'O');
    },
    [board, playerMark, roundFinished]
  );

  const play = useCallback(
    (index: number) => {
      if (currentTurn !== playerMark) {
        return;
      }
      applyMove(index, playerMark);
    },
    [applyMove, currentTurn, playerMark]
  );

  useEffect(() => {
    if (!isComputerTurn) {
      clearAiTimer();
      return;
    }

    clearAiTimer();
    aiTimeoutRef.current = setTimeout(() => {
      const move = chooseComputerMove(board, computerMark, playerMark);
      if (move >= 0) {
        applyMove(move, computerMark);
      }
    }, 420);

    return () => clearAiTimer();
  }, [applyMove, board, clearAiTimer, computerMark, isComputerTurn, playerMark]);

  const playAgain = useCallback(() => {
    clearAiTimer();
    setBoard(createEmptyBoard());
    setCurrentTurn('O');
    setRoundFinished(false);
  }, [clearAiTimer]);

  const resetMatch = useCallback(() => {
    clearAiTimer();
    setBoard(createEmptyBoard());
    setCurrentTurn('O');
    setRoundFinished(false);
    setScore({ playerWins: 0, computerWins: 0, draws: 0 });
  }, [clearAiTimer]);

  const choosePlayerMark = useCallback(
    (next: Mark) => {
      clearAiTimer();
      setPlayerMark(next);
      setBoard(createEmptyBoard());
      setCurrentTurn('O');
      setRoundFinished(false);
      setScore({ playerWins: 0, computerWins: 0, draws: 0 });
    },
    [clearAiTimer]
  );

  return {
    board,
    playerMark,
    computerMark,
    currentTurn,
    isComputerTurn,
    score,
    outcome,
    roundFinished,
    play,
    playAgain,
    resetMatch,
    choosePlayerMark,
  };
};

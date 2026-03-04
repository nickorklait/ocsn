import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STRATOS_IMAGES } from '../../assets/stratosImages';
import { loadBestTime, saveBestTime } from '../../storage/bestTimes';
import { buildDeck, DEFAULT_PAIRS, HARD_PAIRS, MemoryCardItem } from './utils';

const FLIP_BACK_DELAY_MS = 800;

export const useMemoryGame = () => {
  const [pairs, setPairs] = useState<number>(DEFAULT_PAIRS);
  const [cards, setCards] = useState<MemoryCardItem[]>(() => buildDeck(STRATOS_IMAGES, DEFAULT_PAIRS));
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const won = matches === pairs;

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const restart = useCallback(
    (nextPairs: number = pairs) => {
      clearTimers();
      setCards(buildDeck(STRATOS_IMAGES, nextPairs));
      setMoves(0);
      setMatches(0);
      setElapsedSeconds(0);
      setIsStarted(false);
      setIsLocked(false);
      startTimeRef.current = null;
    },
    [clearTimers, pairs]
  );

  useEffect(() => {
    let active = true;
    loadBestTime(pairs).then((value) => {
      if (active) {
        setBestTime(value);
      }
    });
    return () => {
      active = false;
    };
  }, [pairs]);

  useEffect(() => {
    if (!isStarted || won) {
      return;
    }
    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) {
        return;
      }
      const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedSeconds(seconds);
    }, 250);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isStarted, won]);

  useEffect(() => {
    if (!won) {
      return;
    }
    clearTimers();
    if (startTimeRef.current) {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }
    saveBestTime(pairs, Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000)).then(
      (nextBest) => setBestTime(nextBest)
    );
  }, [won, clearTimers, pairs]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const changeDifficulty = useCallback(
    (nextPairs: number) => {
      if (nextPairs !== DEFAULT_PAIRS && nextPairs !== HARD_PAIRS) {
        return;
      }
      setPairs(nextPairs);
      restart(nextPairs);
    },
    [restart]
  );

  const onCardPress = useCallback(
    (cardId: string) => {
      if (isLocked || won) {
        return;
      }

      let selected: MemoryCardItem[] = [];

      setCards((prev) => {
        const tapped = prev.find((item) => item.id === cardId);
        if (!tapped || tapped.isFlipped || tapped.isMatched) {
          return prev;
        }

        if (!isStarted) {
          setIsStarted(true);
          startTimeRef.current = Date.now();
        }

        const next = prev.map((item) =>
          item.id === cardId ? { ...item, isFlipped: true } : item
        );
        selected = next.filter((item) => item.isFlipped && !item.isMatched);
        return next;
      });

      if (selected.length !== 2) {
        return;
      }

      setIsLocked(true);
      setMoves((value) => value + 1);

      const [first, second] = selected;
      if (first.imageId === second.imageId) {
        setCards((prev) =>
          prev.map((item) =>
            item.id === first.id || item.id === second.id ? { ...item, isMatched: true } : item
          )
        );
        setMatches((value) => value + 1);
        setIsLocked(false);
        return;
      }

      timeoutRef.current = setTimeout(() => {
        setCards((prev) =>
          prev.map((item) =>
            item.id === first.id || item.id === second.id ? { ...item, isFlipped: false } : item
          )
        );
        setIsLocked(false);
      }, FLIP_BACK_DELAY_MS);
    },
    [isLocked, isStarted, won]
  );

  const difficultyLabel = useMemo(() => (pairs === HARD_PAIRS ? 'hard' : 'easy'), [pairs]);

  return {
    cards,
    pairs,
    moves,
    matches,
    won,
    isLocked,
    elapsedSeconds,
    bestTime,
    difficultyLabel,
    onCardPress,
    restart,
    shuffle: restart,
    changeDifficulty,
  };
};

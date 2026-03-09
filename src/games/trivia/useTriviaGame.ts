import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TRIVIA_QUESTIONS } from './questions';
import { scoreAnswer } from './scoring';
import { TriviaFeedback, TriviaLeaderboardEntry } from './types';

const LEADERBOARD_KEY = 'stratos_trivia_leaderboard_v1';
const MAX_LEADERBOARD_ENTRIES = 10;
const QUESTIONS_PER_ROUND = 10;

type TriviaPhase = 'start' | 'question' | 'result';

const buildEntry = (
  score: number,
  correctAnswers: number,
  totalQuestions: number
): TriviaLeaderboardEntry => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  score,
  dateIso: new Date().toISOString(),
  correctAnswers,
  totalQuestions,
  percentage: Math.round((correctAnswers / totalQuestions) * 100),
});

const sortLeaderboard = (entries: TriviaLeaderboardEntry[]) =>
  [...entries]
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime();
    })
    .slice(0, MAX_LEADERBOARD_ENTRIES);

const shuffleArray = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const shuffleQuestionOptions = (question: (typeof TRIVIA_QUESTIONS)[number]) => {
  const correctOption = question.options[question.correctOptionIndex];
  const shuffledOptions = shuffleArray(question.options);
  return {
    ...question,
    options: shuffledOptions,
    correctOptionIndex: shuffledOptions.findIndex((option) => option === correctOption),
  };
};

const pickRandomQuestions = () => {
  const shuffledQuestions = shuffleArray(TRIVIA_QUESTIONS).slice(
    0,
    Math.min(QUESTIONS_PER_ROUND, TRIVIA_QUESTIONS.length)
  );
  return shuffledQuestions.map(shuffleQuestionOptions);
};

export const useTriviaGame = () => {
  const [phase, setPhase] = useState<TriviaPhase>('start');
  const [sessionQuestions, setSessionQuestions] = useState(() => pickRandomQuestions());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState<TriviaFeedback | null>(null);
  const [leaderboard, setLeaderboard] = useState<TriviaLeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  const questionStartTimeRef = useRef<number>(0);
  const nextQuestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalQuestions = sessionQuestions.length;
  const currentQuestion = sessionQuestions[questionIndex];

  const loadLeaderboard = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(LEADERBOARD_KEY);
      if (!raw) {
        setLeaderboard([]);
        return;
      }
      const parsed = JSON.parse(raw) as TriviaLeaderboardEntry[];
      setLeaderboard(sortLeaderboard(parsed));
    } catch {
      setLeaderboard([]);
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    if (phase === 'question') {
      questionStartTimeRef.current = Date.now();
    }
  }, [phase, questionIndex]);

  useEffect(() => {
    return () => {
      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current);
      }
    };
  }, []);

  const startGame = () => {
    if (nextQuestionTimerRef.current) {
      clearTimeout(nextQuestionTimerRef.current);
    }
    setSessionQuestions(pickRandomQuestions());
    setPhase('question');
    setQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setFeedback(null);
  };

  const saveResult = useCallback(
    async (finalScore: number, finalCorrectAnswers: number) => {
      const entry = buildEntry(finalScore, finalCorrectAnswers, totalQuestions);
      const merged = sortLeaderboard([entry, ...leaderboard]);
      setLeaderboard(merged);
      try {
        await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(merged));
      } catch {
        // Ignore storage errors and keep in-memory leaderboard.
      }
    },
    [leaderboard, totalQuestions]
  );

  const goToNextQuestion = useCallback(
    (nextIndex: number, nextScore: number, nextCorrectAnswers: number) => {
      if (nextIndex >= totalQuestions) {
        setPhase('result');
        void saveResult(nextScore, nextCorrectAnswers);
        return;
      }
      setQuestionIndex(nextIndex);
      setFeedback(null);
    },
    [saveResult, totalQuestions]
  );

  const answerQuestion = (selectedOptionIndex: number) => {
    if (!currentQuestion || feedback) {
      return;
    }

    const isCorrect = selectedOptionIndex === currentQuestion.correctOptionIndex;
    const answerTimeMs = Date.now() - questionStartTimeRef.current;
    const pointsAwarded = scoreAnswer(isCorrect, answerTimeMs);
    const nextScore = score + pointsAwarded;
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
    const nextIndex = questionIndex + 1;

    setScore(nextScore);
    setCorrectAnswers(nextCorrectAnswers);
    setFeedback({
      selectedOptionIndex,
      isCorrect,
      correctOptionIndex: currentQuestion.correctOptionIndex,
      pointsAwarded,
    });

    nextQuestionTimerRef.current = setTimeout(() => {
      goToNextQuestion(nextIndex, nextScore, nextCorrectAnswers);
    }, 1000);
  };

  const progressLabel = useMemo(
    () => `Question ${Math.min(questionIndex + 1, totalQuestions)} of ${totalQuestions}`,
    [questionIndex, totalQuestions]
  );

  return {
    phase,
    currentQuestion,
    questionIndex,
    totalQuestions,
    score,
    correctAnswers,
    feedback,
    leaderboard,
    leaderboardLoading,
    progressLabel,
    startGame,
    answerQuestion,
    playAgain: startGame,
    leaderboardKey: LEADERBOARD_KEY,
  };
};

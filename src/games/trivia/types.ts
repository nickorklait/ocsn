export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  note?: string;
}

export interface TriviaLeaderboardEntry {
  id: string;
  score: number;
  dateIso: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
}

export type TriviaFeedback = {
  selectedOptionIndex: number;
  isCorrect: boolean;
  correctOptionIndex: number;
  pointsAwarded: number;
};

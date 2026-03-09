const BASE_POINTS = 10;
const MAX_SPEED_BONUS = 5;
const BONUS_WINDOW_MS = 8000;

export const scoreAnswer = (isCorrect: boolean, answerTimeMs: number) => {
  if (!isCorrect) {
    return 0;
  }

  const clampedTime = Math.max(0, Math.min(BONUS_WINDOW_MS, answerTimeMs));
  const speedRatio = 1 - clampedTime / BONUS_WINDOW_MS;
  const speedBonus = Math.round(speedRatio * MAX_SPEED_BONUS);

  return BASE_POINTS + speedBonus;
};

export const getBasePoints = () => BASE_POINTS;

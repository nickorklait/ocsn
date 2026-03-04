import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PREFIX = 'memory_game_best_time_';

const keyForPairs = (pairs: number) => `${KEY_PREFIX}${pairs}`;

export const loadBestTime = async (pairs: number): Promise<number | null> => {
  const raw = await AsyncStorage.getItem(keyForPairs(pairs));
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const saveBestTime = async (pairs: number, seconds: number): Promise<number> => {
  const currentBest = await loadBestTime(pairs);
  if (currentBest === null || seconds < currentBest) {
    await AsyncStorage.setItem(keyForPairs(pairs), String(seconds));
    return seconds;
  }
  return currentBest;
};

import { StratosImage } from '../../assets/stratosImages';

export type MemoryCardItem = {
  id: string;
  imageId: string;
  imageSrc: StratosImage['src'];
  isFlipped: boolean;
  isMatched: boolean;
};

export const DEFAULT_PAIRS = 6;
export const HARD_PAIRS = 8;

export const shuffle = <T>(source: T[]): T[] => {
  const next = [...source];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const buildDeck = (images: StratosImage[], pairs: number): MemoryCardItem[] => {
  const selected = shuffle(images).slice(0, pairs);
  const duplicated = selected.flatMap((image) => [
    {
      id: `${image.id}-a`,
      imageId: image.id,
      imageSrc: image.src,
      isFlipped: false,
      isMatched: false,
    },
    {
      id: `${image.id}-b`,
      imageId: image.id,
      imageSrc: image.src,
      isFlipped: false,
      isMatched: false,
    },
  ]);
  return shuffle(duplicated);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

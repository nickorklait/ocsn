import { WheelSegment } from './config';

export const normalizeAngle = (angle: number): number => {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

export const getSegmentSize = (segmentCount: number): number => 360 / segmentCount;

export const chooseOutcome = (winProbability: number): boolean => Math.random() < winProbability;

const pickRandom = (indexes: number[]): number => indexes[Math.floor(Math.random() * indexes.length)];

export const pickTargetIndex = (segments: WheelSegment[], shouldWin: boolean): number => {
  const candidates = segments
    .map((segment, index) => ({ segment, index }))
    .filter((entry) => entry.segment.isWin === shouldWin)
    .map((entry) => entry.index);

  if (candidates.length === 0) {
    return Math.floor(Math.random() * segments.length);
  }

  return pickRandom(candidates);
};

export const getRotationForIndex = (targetIndex: number, segmentCount: number): number => {
  const step = getSegmentSize(segmentCount);
  const segmentCenter = targetIndex * step + step / 2;
  return normalizeAngle(360 - segmentCenter);
};

export const getIndexFromRotation = (rotationDeg: number, segmentCount: number): number => {
  const step = getSegmentSize(segmentCount);
  const normalized = normalizeAngle(rotationDeg);
  const angleAtPointer = normalizeAngle(360 - normalized);
  const index = Math.floor(angleAtPointer / step);
  return Math.min(segmentCount - 1, Math.max(0, index));
};

export const getSpinTargetValue = (
  currentRotation: number,
  targetIndex: number,
  segmentCount: number
): number => {
  const base = normalizeAngle(currentRotation);
  const target = getRotationForIndex(targetIndex, segmentCount);
  const delta = normalizeAngle(target - base);
  const extraSpins = 3 + Math.floor(Math.random() * 4);
  return currentRotation + extraSpins * 360 + delta;
};

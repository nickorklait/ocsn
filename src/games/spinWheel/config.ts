export type WheelSegment = {
  id: string;
  label: string;
  isWin: boolean;
  color: string;
};

export const WHEEL_CONFIG: { segments: WheelSegment[]; winProbability: number } = {
  segments: [
    { id: 'lose-1', label: 'LOSE', isWin: false, color: '#2248b8' },
    { id: 'lose-2', label: 'LOSE', isWin: false, color: '#2d56cd' },
    { id: 'win-1', label: 'WIN', isWin: true, color: '#3aa3f5' },
    { id: 'lose-3', label: 'LOSE', isWin: false, color: '#2448b0' },
    { id: 'lose-4', label: 'LOSE', isWin: false, color: '#2f57c8' },
    { id: 'lose-5', label: 'LOSE', isWin: false, color: '#2346a9' },
    { id: 'win-2', label: 'WIN', isWin: true, color: '#4cc9f0' },
    { id: 'lose-6', label: 'LOSE', isWin: false, color: '#2b50bd' },
  ],
  winProbability: 0.2,
};

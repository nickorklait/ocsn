import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Cell } from './Cell';
import { BoardState, COLUMNS, CellCoord, ROWS } from './utils';

type BoardProps = {
  board: BoardState;
  winningCells: CellCoord[];
  onDrop: (col: number) => void;
  disabled?: boolean;
};

const makeCoordKey = (row: number, col: number) => `${row}-${col}`;

export const Board = ({ board, winningCells, onDrop, disabled }: BoardProps) => {
  const { width } = useWindowDimensions();
  const boardWidth = Math.min(width - 20, 430);
  const gap = 6;
  const padding = 8;
  const cellSize = Math.floor((boardWidth - padding * 2 - gap * (COLUMNS - 1)) / COLUMNS);

  const winningSet = useMemo(
    () => new Set(winningCells.map((cell) => makeCoordKey(cell.row, cell.col))),
    [winningCells]
  );

  return (
    <View style={[styles.board, { width: boardWidth, padding }]}>
      {Array.from({ length: ROWS }).map((_, row) => (
        <View key={`row-${row}`} style={[styles.row, row < ROWS - 1 ? { marginBottom: gap } : null]}>
          {Array.from({ length: COLUMNS }).map((__, col) => (
            <View key={`cell-${row}-${col}`} style={col < COLUMNS - 1 ? { marginRight: gap } : null}>
              <Cell
                value={board[row][col]}
                size={cellSize}
                onPress={() => onDrop(col)}
                disabled={disabled}
                isWinning={winningSet.has(makeCoordKey(row, col))}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: 16,
    backgroundColor: '#143899',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.24)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

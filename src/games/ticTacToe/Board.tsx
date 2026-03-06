import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Cell } from './Cell';
import { BoardState } from './utils';

type BoardProps = {
  board: BoardState;
  winningLine: number[] | null;
  playerMark: 'O' | 'X';
  computerMark: 'O' | 'X';
  onPressCell: (index: number) => void;
  disabled?: boolean;
};

export const Board = ({
  board,
  winningLine,
  playerMark,
  computerMark,
  onPressCell,
  disabled,
}: BoardProps) => {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - 32, 360);
  const outerPadding = 8;
  const gap = 8;
  const innerBoard = boardSize - outerPadding * 2;
  const cellSize = Math.floor((innerBoard - gap * 2) / 3);

  return (
    <View style={[styles.board, { width: boardSize, padding: outerPadding }]}>
      {Array.from({ length: 3 }).map((_, row) => (
        <View key={`row-${row}`} style={[styles.row, row < 2 ? { marginBottom: gap } : null]}>
          {Array.from({ length: 3 }).map((__, col) => {
            const index = row * 3 + col;
            return (
              <View key={`cell-${index}`} style={col < 2 ? { marginRight: gap } : null}>
                <Cell
                  value={board[index]}
                  playerMark={playerMark}
                  computerMark={computerMark}
                  size={cellSize}
                  onPress={() => onPressCell(index)}
                  isWinning={Boolean(winningLine?.includes(index))}
                  disabled={disabled}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: 16,
    backgroundColor: 'rgba(10, 38, 115, 0.62)',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
  },
  row: {
    flexDirection: 'row',
  },
});

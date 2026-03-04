import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { EMPTY_TILE, GRID_SIZE } from './utils';
import { Tile } from './Tile';

type SlidingPuzzleBoardProps = {
  board: number[];
  tileSize: number;
  onTilePress: (position: number) => void;
  gridSize?: number;
};

export const SlidingPuzzleBoard = ({
  board,
  tileSize,
  onTilePress,
  gridSize = GRID_SIZE,
}: SlidingPuzzleBoardProps) => {
  const boardSize = tileSize * gridSize;

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}>
      {board.map((tile, position) => {
        if (tile === EMPTY_TILE) {
          return (
            <View
              key={`empty-${position}`}
              style={[
                styles.emptySlot,
                {
                  width: tileSize - 4,
                  height: tileSize - 4,
                  top: Math.floor(position / gridSize) * tileSize + 2,
                  left: (position % gridSize) * tileSize + 2,
                },
              ]}
            />
          );
        }

        return (
          <Tile
            key={`tile-${tile}`}
            tile={tile}
            position={position}
            tileSize={tileSize}
            gridSize={gridSize}
            onPress={() => onTilePress(position)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.18)',
  },
  emptySlot: {
    position: 'absolute',
    borderRadius: 8,
    backgroundColor: colors.brandBackground,
    opacity: 0.5,
  },
});

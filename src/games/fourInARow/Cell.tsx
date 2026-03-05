import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { STRATOS_PIECES } from '../../assets/stratosImages';
import { CellValue, Player } from './utils';

type CellProps = {
  value: CellValue;
  size: number;
  onPress: () => void;
  disabled?: boolean;
  isWinning?: boolean;
};

const ringColorForPlayer = (player: Player): string =>
  player === 1 ? '#f9c74f' : 'rgba(233, 238, 255, 0.95)';

export const Cell = ({ value, size, onPress, disabled, isWinning }: CellProps) => {
  const playerValue: Player | null = value === 1 || value === 2 ? value : null;
  const imageSource = playerValue === 1 ? STRATOS_PIECES.p1 : playerValue === 2 ? STRATOS_PIECES.p2 : null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.cell,
        { width: size, height: size, borderRadius: size / 2 },
        isWinning ? styles.winningCell : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={value ? `Player ${value} piece` : 'Drop piece'}
    >
      {imageSource ? (
        <View
          style={[
            styles.pieceRing,
            {
              borderRadius: (size - 8) / 2,
              borderColor: playerValue === 1 ? ringColorForPlayer(1) : ringColorForPlayer(2),
            },
          ]}
        >
          <Image source={imageSource} style={styles.pieceImage} resizeMode="cover" />
        </View>
      ) : (
        <View style={styles.emptyHole} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8, 20, 66, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.12)',
  },
  emptyHole: {
    width: '70%',
    height: '70%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  pieceRing: {
    width: '82%',
    height: '82%',
    borderWidth: 2,
    padding: 2,
    overflow: 'hidden',
  },
  pieceImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  winningCell: {
    shadowColor: '#4cc9f0',
    shadowOpacity: 0.9,
    shadowRadius: 9,
    borderColor: '#4cc9f0',
    borderWidth: 2,
    elevation: 6,
  },
});

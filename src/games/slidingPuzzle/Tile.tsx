import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';

type TileProps = {
  tile: number;
  position: number;
  tileSize: number;
  gridSize: number;
  onPress: () => void;
};

const PUZZLE_IMAGE = require('../../../assets/stratos/stratoskua (1).jpg');

export const Tile = ({ tile, position, tileSize, gridSize, onPress }: TileProps) => {
  const sourceRow = Math.floor(tile / gridSize);
  const sourceCol = tile % gridSize;
  const targetRow = Math.floor(position / gridSize);
  const targetCol = position % gridSize;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tileWrap,
        {
          width: tileSize,
          height: tileSize,
          top: targetRow * tileSize,
          left: targetCol * tileSize,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Tile ${tile + 1}`}
    >
      <View style={styles.tileInner}>
        <Image
          source={PUZZLE_IMAGE}
          style={{
            width: tileSize * gridSize,
            height: tileSize * gridSize,
            transform: [
              { translateX: -sourceCol * tileSize },
              { translateY: -sourceRow * tileSize },
            ],
          }}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tileWrap: {
    position: 'absolute',
    padding: 2,
  },
  tileInner: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.35)',
    backgroundColor: colors.brandBackground,
  },
});

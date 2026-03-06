import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CellValue, Mark } from './utils';

type CellProps = {
  value: CellValue;
  playerMark: Mark;
  computerMark: Mark;
  size: number;
  onPress: () => void;
  isWinning?: boolean;
  disabled?: boolean;
};

const COMPUTER_IMAGE = require('../../../assets/stratos/stratoskua (1).jpg');

export const Cell = ({
  value,
  playerMark,
  computerMark,
  size,
  onPress,
  isWinning,
  disabled,
}: CellProps) => {
  const pop = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!value) {
      pop.setValue(0.7);
      return;
    }
    Animated.spring(pop, {
      toValue: 1,
      bounciness: 10,
      speed: 14,
      useNativeDriver: true,
    }).start();
  }, [value, pop]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || Boolean(value)}
      style={[
        styles.cell,
        { width: size, height: size, borderRadius: size * 0.2 },
        isWinning ? styles.winning : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={value ? `${value} mark` : 'Empty cell'}
    >
      {value ? (
        <Animated.View style={{ transform: [{ scale: pop }] }}>
          {value === computerMark ? (
            <Image
              source={COMPUTER_IMAGE}
              style={{ width: size * 0.68, height: size * 0.68, borderRadius: size * 0.14 }}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.playerMarkWrap, { width: size * 0.68, height: size * 0.68, borderRadius: size * 0.34 }]}>
              <Text style={styles.playerMarkText}>{playerMark}</Text>
            </View>
          )}
        </Animated.View>
      ) : (
        <View style={styles.emptyDot} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 51, 142, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.26)',
  },
  winning: {
    borderColor: '#4cc9f0',
    borderWidth: 2,
    shadowColor: '#4cc9f0',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(233, 238, 255, 0.28)',
  },
  playerMarkWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.45)',
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
  },
  playerMarkText: {
    color: '#e9eeff',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
  },
});

import React, { useMemo } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { STRATOS_PIECES } from '../../assets/stratosImages';
import { WheelSegment } from './config';

type WheelProps = {
  segments: WheelSegment[];
  rotation: Animated.Value;
  size: number;
};

export const Wheel = ({ segments, rotation, size }: WheelProps) => {
  const step = 360 / segments.length;
  const labelRadius = size * 0.35;
  const center = size / 2;

  const rotateInterpolate = useMemo(
    () =>
      rotation.interpolate({
        inputRange: [0, 20000],
        outputRange: ['0deg', '20000deg'],
      }),
    [rotation]
  );

  return (
    <Animated.View
      style={[
        styles.wheel,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ rotate: rotateInterpolate }],
        },
      ]}
    >
      {segments.map((segment, index) => {
        const angleDeg = index * step;
        const angleRad = ((angleDeg - 90) * Math.PI) / 180;
        const labelX = center + labelRadius * Math.cos(angleRad);
        const labelY = center + labelRadius * Math.sin(angleRad);
        const labelWidth = size * 0.33;
        const labelHeight = 36;

        return (
          <React.Fragment key={segment.id}>
            <View
              style={[
                styles.separator,
                {
                  top: center - 1,
                  left: 0,
                  width: size,
                  transform: [{ rotate: `${angleDeg}deg` }],
                },
              ]}
            />
            <View
              style={[
                styles.labelWrap,
                {
                  width: labelWidth,
                  height: labelHeight,
                  left: labelX - labelWidth / 2,
                  top: labelY - labelHeight / 2,
                  backgroundColor: segment.color,
                },
              ]}
            >
              <Image
                source={segment.isWin ? STRATOS_PIECES.p1 : STRATOS_PIECES.p2}
                style={styles.labelImage}
                resizeMode="cover"
              />
              <Text style={styles.labelText}>{segment.label}</Text>
            </View>
          </React.Fragment>
        );
      })}
      <View
        style={[
          styles.centerCap,
          {
            width: size * 0.16,
            height: size * 0.16,
            borderRadius: size * 0.08,
            left: center - size * 0.08,
            top: center - size * 0.08,
          },
        ]}
      >
        <Image source={STRATOS_PIECES.p1} style={styles.centerImage} resizeMode="cover" />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wheel: {
    backgroundColor: '#183b9a',
    borderWidth: 4,
    borderColor: 'rgba(233, 238, 255, 0.25)',
    overflow: 'hidden',
    shadowColor: '#4cc9f0',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  separator: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(233, 238, 255, 0.35)',
  },
  labelWrap: {
    position: 'absolute',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 6,
  },
  labelImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  labelText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  centerCap: {
    position: 'absolute',
    backgroundColor: '#dbe7ff',
    borderWidth: 2,
    borderColor: '#9eb6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerImage: {
    width: '72%',
    height: '72%',
    borderRadius: 999,
  },
});

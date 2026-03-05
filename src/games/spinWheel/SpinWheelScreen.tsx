import React, { useMemo, useRef, useState } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Animated, Easing, Pressable, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { Pointer } from './Pointer';
import { ResultModal } from './ResultModal';
import { WHEEL_CONFIG, WheelSegment } from './config';
import { Wheel } from './Wheel';
import { chooseOutcome, getIndexFromRotation, getSpinTargetValue, normalizeAngle, pickTargetIndex } from './utils';

export const SpinWheelScreen = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const wheelSize = Math.min(width - 44, 360);

  const [isSpinning, setIsSpinning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [didWin, setDidWin] = useState(false);
  const [landedSegment, setLandedSegment] = useState<WheelSegment | null>(null);

  const rotation = useRef(new Animated.Value(0)).current;
  const currentRotationRef = useRef(0);

  const segments = WHEEL_CONFIG.segments;
  const winProbability = WHEEL_CONFIG.winProbability;

  const spinLabel = useMemo(() => (isSpinning ? 'Spinning...' : 'SPIN'), [isSpinning]);

  const handleSpin = () => {
    if (isSpinning) {
      return;
    }

    const shouldWin = chooseOutcome(winProbability);
    const targetIndex = pickTargetIndex(segments, shouldWin);
    const targetValue = getSpinTargetValue(currentRotationRef.current, targetIndex, segments.length);

    setIsSpinning(true);
    setDidWin(shouldWin);
    setLandedSegment(null);

    Animated.timing(rotation, {
      toValue: targetValue,
      duration: 3600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      const normalized = normalizeAngle(targetValue);
      const landedIndex = getIndexFromRotation(normalized, segments.length);
      const finalSegment = segments[landedIndex];
      currentRotationRef.current = normalized;
      rotation.setValue(normalized);
      setLandedSegment(finalSegment);
      setDidWin(finalSegment.isWin);
      setIsSpinning(false);
      setModalVisible(true);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={styles.topBarButtonText}>Menu</Text>
        </Pressable>
        <Pressable
          style={styles.topBarButton}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate(routes.Tabs))}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={styles.topBarButtonText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Spin the Wheel</Text>
        <Text style={styles.subtitle}>Tap spin and see if luck lands on WIN.</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>8 Segments</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaText}>Win chance {(winProbability * 100).toFixed(0)}%</Text>
          </View>
          <View style={[styles.metaChip, styles.winChip]}>
            <Text style={styles.metaText}>WIN slots are cyan</Text>
          </View>
        </View>
      </View>

      <View style={styles.wheelArea}>
        <View style={styles.backdropOrbLarge} />
        <View style={styles.backdropOrbSmall} />
        <Pointer size={26} />
        <View style={styles.wheelFrame}>
          <Wheel segments={segments} rotation={rotation} size={wheelSize} />
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.spinButton, isSpinning ? styles.spinButtonDisabled : null]}
          onPress={handleSpin}
          disabled={isSpinning}
          accessibilityRole="button"
          accessibilityLabel="Spin the wheel"
        >
          <Text style={styles.spinButtonText}>{spinLabel}</Text>
        </Pressable>
        <Text style={styles.helperText}>The wheel always lands cleanly on one segment.</Text>
      </View>

      <ResultModal
        visible={modalVisible}
        didWin={didWin}
        landedLabel={landedSegment?.label || null}
        onPlayAgain={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1e61',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  topBarButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  topBarButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  title: {
    color: colors.brandText,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: 'rgba(233, 238, 255, 0.84)',
    fontSize: 14,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaChip: {
    marginRight: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.22)',
    backgroundColor: 'rgba(233, 238, 255, 0.11)',
  },
  metaText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  winChip: {
    backgroundColor: 'rgba(76, 201, 240, 0.2)',
    borderColor: 'rgba(76, 201, 240, 0.55)',
  },
  wheelArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wheelFrame: {
    marginTop: 10,
    padding: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.26)',
    backgroundColor: 'rgba(15, 46, 132, 0.45)',
  },
  backdropOrbLarge: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(76, 201, 240, 0.08)',
    top: '35%',
    left: '15%',
  },
  backdropOrbSmall: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(233, 238, 255, 0.06)',
    top: '18%',
    right: '12%',
  },
  controls: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    alignItems: 'center',
  },
  spinButton: {
    minWidth: 180,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    backgroundColor: '#4cc9f0',
  },
  spinButtonDisabled: {
    opacity: 0.6,
  },
  spinButtonText: {
    color: '#062562',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  helperText: {
    marginTop: 10,
    color: 'rgba(233, 238, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
});

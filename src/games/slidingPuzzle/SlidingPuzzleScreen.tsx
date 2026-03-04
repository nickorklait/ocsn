import React, { useEffect, useMemo, useRef } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../../theme/colors';
import { routes } from '../../navigation/routes';
import { SlidingPuzzleBoard } from './SlidingPuzzleBoard';
import { GRID_SIZE } from './utils';
import { useSlidingPuzzle } from './useSlidingPuzzle';

export const SlidingPuzzleScreen = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const { board, moves, solved, handleTilePress, shuffle, reset } = useSlidingPuzzle(GRID_SIZE);

  const solvedOpacity = useRef(new Animated.Value(0)).current;
  const solvedScale = useRef(new Animated.Value(0.92)).current;

  const tileSize = useMemo(() => {
    const boardWidth = Math.min(width - 36, 420);
    return Math.floor(boardWidth / GRID_SIZE);
  }, [width]);

  useEffect(() => {
    if (!solved) {
      solvedOpacity.setValue(0);
      solvedScale.setValue(0.92);
      return;
    }

    Animated.parallel([
      Animated.timing(solvedOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(solvedScale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 8,
      }),
    ]).start();
  }, [solved, solvedOpacity, solvedScale]);

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
          onPress={() => navigation.navigate(routes.Tabs)}
          accessibilityRole="button"
          accessibilityLabel="Go to home"
        >
          <Text style={styles.topBarButtonText}>Home</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Sliding Puzzle</Text>
        <Text style={styles.subtitle}>Move tiles until the Stratos cow is complete.</Text>
      </View>

      <View style={styles.center}>
        <View>
          <SlidingPuzzleBoard board={board} tileSize={tileSize} onTilePress={handleTilePress} />
          {solved ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.solvedOverlay,
                {
                  opacity: solvedOpacity,
                  transform: [{ scale: solvedScale }],
                },
              ]}
            >
              <Text style={styles.solvedText}>You solved it!</Text>
            </Animated.View>
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.moves}>Moves: {moves}</Text>
        <View style={styles.controls}>
          <Pressable style={styles.controlButton} onPress={shuffle}>
            <Text style={styles.controlButtonText}>Shuffle</Text>
          </Pressable>
          <Pressable style={styles.controlButton} onPress={reset}>
            <Text style={styles.controlButtonText}>Reset</Text>
          </Pressable>
        </View>
      </View>
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
    alignItems: 'center',
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
    color: 'rgba(233, 238, 255, 0.82)',
    fontSize: 14,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  solvedOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 201, 240, 0.9)',
    alignItems: 'center',
  },
  solvedText: {
    color: '#02214f',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 18,
    paddingBottom: 16,
    paddingTop: 8,
  },
  moves: {
    color: colors.brandText,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
  },
  controlButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(233, 238, 255, 0.16)',
  },
  controlButtonText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '700',
  },
});

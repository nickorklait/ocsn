import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
  Animated,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { colors } from '../theme/colors';
import { routes } from '../navigation/routes';

const COW_IMAGE = require('../../assets/stratos/stratoskua (1).jpg');
const STRATOS_DECOYS = [
  require('../../assets/stratos/stratoskua (2).jpg'),
  require('../../assets/stratos/stratoskua (3).jpg'),
  require('../../assets/stratos/stratoskua (4).jpg'),
  require('../../assets/stratos/stratoskua (5).jpg'),
  require('../../assets/stratos/stratoskua (6).jpg'),
  require('../../assets/stratos/stratoskua (7).jpg'),
  require('../../assets/stratos/stratoskua (8).jpg'),
  require('../../assets/stratos/stratoskua (9).jpg'),
  require('../../assets/stratos/stratoskua (10).jpg'),
  require('../../assets/stratos/468452458_10160128173601010_3553702921976300069_n.jpg'),
  require('../../assets/stratos/468967284_10160183939886010_3949752905294167014_n.jpg'),
];

type DecoySource = {
  emoji: string;
  tint: string;
  seed: number;
  local?: number;
};

type ItemKind = 'cow' | 'decoy';

type PlayfieldItem = {
  id: string;
  kind: ItemKind;
  x: number;
  y: number;
  size: number;
  rotation: number;
  source?: DecoySource;
};

type BackgroundShape = {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
};

const EMOJI_POOL = [
  '🍉',
  '🍔',
  '🍕',
  '🍟',
  '🍩',
  '🍪',
  '🍓',
  '🍋',
  '🍍',
  '🥕',
  '🌮',
  '🍣',
  '🍦',
  '🧁',
  '🍄',
  '🥨',
  '🍇',
  '🥑',
  '🍊',
  '🍭',
];

const COLOR_POOL = [
  '#f94144',
  '#f3722c',
  '#f9844a',
  '#f9c74f',
  '#90be6d',
  '#43aa8b',
  '#4d908e',
  '#577590',
  '#277da1',
  '#b5179e',
  '#7209b7',
  '#4cc9f0',
];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const randomInt = (min: number, max: number) => Math.floor(randomBetween(min, max + 1));

const createDecoySources = (count: number): DecoySource[] => {
  return Array.from({ length: count }).map((_, index) => {
    const seed = randomInt(1000, 99999);
    const emoji = EMOJI_POOL[index % EMOJI_POOL.length];
    const tint = COLOR_POOL[index % COLOR_POOL.length];
    const local = STRATOS_DECOYS[index % STRATOS_DECOYS.length];
    return {
      emoji,
      tint,
      seed,
      local,
    };
  });
};

const createBackgroundShapes = (
  count: number,
  width: number,
  height: number
): BackgroundShape[] => {
  return Array.from({ length: count }).map((_, index) => {
    const size = randomBetween(160, 360);
    return {
      id: `shape-${index}`,
      x: randomBetween(0, Math.max(0, width - size)),
      y: randomBetween(0, Math.max(0, height - size)),
      size,
      color: COLOR_POOL[index % COLOR_POOL.length],
      opacity: randomBetween(0.08, 0.18),
    };
  });
};

const placeItem = (
  items: PlayfieldItem[],
  size: number,
  width: number,
  height: number
) => {
  const padding = 6;
  let attempts = 0;
  while (attempts < 220) {
    attempts += 1;
    const x = randomBetween(padding, width - size - padding);
    const y = randomBetween(padding, height - size - padding);
    const hasCollision = items.some((item) => {
      const dx = item.x - x;
      const dy = item.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (item.size + size) * 0.45;
    });
    if (!hasCollision) {
      return { x, y };
    }
  }
  return {
    x: randomBetween(padding, width - size - padding),
    y: randomBetween(padding, height - size - padding),
  };
};

const ConfettiBurst = ({ visible }: { visible: boolean }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, index) => ({
        id: `confetti-${index}`,
        x: randomBetween(30, 320),
        y: randomBetween(0, 40),
        size: randomBetween(6, 12),
        spin: randomInt(120, 360) * (index % 2 === 0 ? 1 : -1),
        color: COLOR_POOL[index % COLOR_POOL.length],
      })),
    []
  );

  const animations = useRef(pieces.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    animations.forEach((anim, index) => {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 1400,
        delay: index * 30,
        useNativeDriver: true,
      }).start();
    });
  }, [visible, animations]);

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.confettiLayer}>
      {pieces.map((piece, index) => {
        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 220],
        });
        const rotate = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${piece.spin}deg`],
        });
        const opacity = animations[index].interpolate({
          inputRange: [0, 0.8, 1],
          outputRange: [1, 1, 0],
        });

        return (
          <Animated.View
            key={piece.id}
            style={[
              styles.confettiPiece,
              {
                left: piece.x,
                top: piece.y,
                width: piece.size,
                height: piece.size * 1.8,
                backgroundColor: piece.color,
                opacity,
                transform: [{ translateY }, { rotate }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const DecoySprite = ({ item }: { item: PlayfieldItem }) => {
  if (!item.source) {
    return null;
  }

  return (
    <View
      style={[
        styles.decoyFrame,
        {
          width: item.size,
          height: item.size,
          borderRadius: item.size / 4,
          backgroundColor: item.source.tint,
        },
      ]}
    >
      {item.source.local ? (
        <Image
          source={item.source.local}
          style={{ width: '100%', height: '100%', borderRadius: item.size / 4 }}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.decoyEmoji}>{item.source.emoji}</Text>
      )}
    </View>
  );
};

export const FindStratoskua = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation<any>();

  // Difficulty tuning (README snippet):
  // - Update PLAYFIELD_SIZE for the overall hunt area.
  // - Adjust DECOY_COUNT for how many decoys appear.
  // - Tweak SIZE_RANGE to change item size variation.
  const PLAYFIELD_SIZE = {
    width: screenWidth,
    height: Math.max(320, screenHeight - 220),
  };
  const DECOY_COUNT = 116;
  const SIZE_RANGE = useMemo(() => [30, 46] as const, []);
  const COW_SIZE_RANGE = useMemo(() => [34, 52] as const, []);

  const [items, setItems] = useState<PlayfieldItem[]>([]);
  const [found, setFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hintOpacity = useRef(new Animated.Value(0)).current;
  const hintScale = useRef(new Animated.Value(0.7)).current;

  const backgroundShapes = useMemo(
    () => createBackgroundShapes(12, PLAYFIELD_SIZE.width, PLAYFIELD_SIZE.height),
    [PLAYFIELD_SIZE.width, PLAYFIELD_SIZE.height]
  );

  const generateItems = useCallback(() => {
    const nextItems: PlayfieldItem[] = [];
    const decoySources = createDecoySources(DECOY_COUNT);

    for (let index = 0; index < DECOY_COUNT; index += 1) {
      const size = randomBetween(SIZE_RANGE[0], SIZE_RANGE[1]);
      const { x, y } = placeItem(nextItems, size, PLAYFIELD_SIZE.width, PLAYFIELD_SIZE.height);
      const source = decoySources[index];
      nextItems.push({
        id: `decoy-${source.seed}`,
        kind: 'decoy',
        x,
        y,
        size,
        rotation: randomBetween(-10, 10),
        source,
      });
    }

    const cowSize = randomBetween(COW_SIZE_RANGE[0], COW_SIZE_RANGE[1]);
    const cowPosition = placeItem(nextItems, cowSize, PLAYFIELD_SIZE.width, PLAYFIELD_SIZE.height);
    nextItems.push({
      id: 'cow',
      kind: 'cow',
      size: cowSize,
      rotation: randomBetween(-8, 8),
      ...cowPosition,
    });

    return nextItems;
  }, [DECOY_COUNT, PLAYFIELD_SIZE.height, PLAYFIELD_SIZE.width, SIZE_RANGE, COW_SIZE_RANGE]);

  useEffect(() => {
    setItems(generateItems());
    startTimeRef.current = Date.now();
  }, [generateItems]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  const cowItem = useMemo(() => items.find((item) => item.kind === 'cow'), [items]);

  const triggerHintPulse = useCallback(() => {
    hintOpacity.setValue(0);
    hintScale.setValue(0.7);

    Animated.parallel([
      Animated.timing(hintOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(hintScale, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(hintOpacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [hintOpacity, hintScale]);

  const handleRestart = useCallback(() => {
    setFound(false);
    setShowModal(false);
    setElapsedSeconds(null);
    setHintCount(0);
    setShowConfetti(false);
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }
    setItems(generateItems());
    startTimeRef.current = Date.now();
  }, [generateItems]);

  const handleFound = useCallback(() => {
    if (found) {
      return;
    }
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    setElapsedSeconds(elapsed);
    setFound(true);
    setShowModal(true);
    setShowConfetti(true);

    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }

    confettiTimeoutRef.current = setTimeout(() => {
      setShowConfetti(false);
    }, 1800);
  }, [found]);

  const handleHint = useCallback(() => {
    if (!cowItem) {
      return;
    }

    if (hintCount === 0) {
      triggerHintPulse();
      setHintCount(1);
      return;
    }

    if (hintCount === 1) {
      triggerHintPulse();
      setHintCount(2);
    }
  }, [cowItem, hintCount, triggerHintPulse]);

  const hintLabel =
    hintCount === 0 ? 'Hint 1 of 2' : hintCount === 1 ? 'Hint 2 of 2' : 'No hints left';

  const ringStyle = useMemo(() => {
    if (!cowItem) {
      return null;
    }
    const ringSize = cowItem.size + 70;
    return {
      width: ringSize,
      height: ringSize,
      left: cowItem.x - (ringSize - cowItem.size) / 2,
      top: cowItem.y - (ringSize - cowItem.size) / 2,
      borderRadius: ringSize / 2,
    };
  }, [cowItem]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={styles.topBarText}>Menu</Text>
        </Pressable>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.navigate(routes.Tabs)}
          accessibilityRole="button"
          accessibilityLabel="Go to main"
        >
          <Text style={styles.topBarText}>Home</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Find Stratoskua</Text>
          <Text style={styles.subtitle}>Find the exact cow shown below.</Text>
          <View style={styles.targetRow}>
            <Image source={COW_IMAGE} style={styles.targetImage} resizeMode="cover" />
            <Text style={styles.targetLabel}>Find this cow</Text>
          </View>
        </View>
        <View style={styles.controls}>
          <Pressable
            style={[styles.controlButton, hintCount >= 2 ? styles.controlButtonDisabled : null]}
            onPress={handleHint}
            accessibilityRole="button"
            accessibilityLabel="Hint"
            disabled={hintCount >= 2}
          >
            <Text style={styles.controlButtonText}>{hintLabel}</Text>
          </Pressable>
          <Pressable
            style={styles.controlButton}
            onPress={handleRestart}
            accessibilityRole="button"
            accessibilityLabel="Restart"
          >
            <Text style={styles.controlButtonText}>Restart</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.playfieldWrap}>
        <View
          style={[
            styles.playfield,
            {
              width: PLAYFIELD_SIZE.width,
              height: PLAYFIELD_SIZE.height,
            },
          ]}
        >
          {backgroundShapes.map((shape) => (
            <View
              key={shape.id}
              pointerEvents="none"
              style={[
                styles.backgroundShape,
                {
                  width: shape.size,
                  height: shape.size,
                  left: shape.x,
                  top: shape.y,
                  borderRadius: shape.size / 2,
                  backgroundColor: shape.color,
                  opacity: shape.opacity,
                },
              ]}
            />
          ))}

              {items.map((item) => (
                <View
                  key={item.id}
                  style={{
                    position: 'absolute',
                    left: item.x,
                    top: item.y,
                    transform: [{ rotate: `${item.rotation}deg` }],
                    zIndex: item.kind === 'cow' ? 2 : 1,
                  }}
                >
                  {item.kind === 'decoy' ? (
                    <DecoySprite item={item} />
                  ) : (
                    <Pressable
                      onPress={handleFound}
                      accessibilityRole="button"
                      accessibilityLabel="Hidden cow"
                      accessibilityHint="Tap to celebrate finding Stratoskua"
                      focusable
                      hitSlop={12}
                      style={{ width: item.size, height: item.size }}
                    >
                      <Image
                        source={COW_IMAGE}
                        style={[styles.cowImage, { width: item.size, height: item.size, borderRadius: item.size / 5 }]}
                        resizeMode="cover"
                      />
                    </Pressable>
                  )}
                </View>
              ))}

          {cowItem && ringStyle ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.hintRing,
                ringStyle,
                {
                  opacity: hintOpacity,
                  transform: [{ scale: hintScale }],
                },
              ]}
            />
          ) : null}
        </View>
      </View>

      <ConfettiBurst visible={showConfetti} />

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalBackdrop} accessibilityLabel="Success modal">
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Winner winner!</Text>
            <Text style={styles.modalText}>
              You found Stratoskua in {elapsedSeconds !== null ? `${elapsedSeconds.toFixed(1)}s` : '—'}.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={handleRestart}
              accessibilityRole="button"
              accessibilityLabel="Play again"
            >
              <Text style={styles.modalButtonText}>Play again</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => setShowModal(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.brandBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topBarButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  topBarText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerText: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.brandText,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(233, 238, 255, 0.8)',
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  targetImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.4)',
  },
  targetLabel: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  controlButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(233, 238, 255, 0.16)',
    marginRight: 10,
    marginBottom: 8,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  playfieldWrap: {
    flex: 1,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.12)',
    backgroundColor: '#102a7a',
  },
  playfield: {
    backgroundColor: '#102a7a',
  },
  backgroundShape: {
    position: 'absolute',
  },
  decoyFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  decoyEmoji: {
    fontSize: 18,
  },
  cowImage: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  hintRing: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#f9f871',
    shadowColor: '#f9f871',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  confettiLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 240,
    alignItems: 'center',
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(6, 13, 40, 0.74)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#132d85',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.brandText,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: 'rgba(233, 238, 255, 0.9)',
    marginBottom: 16,
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(233, 238, 255, 0.18)',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonSecondary: {
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
  },
  modalButtonText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

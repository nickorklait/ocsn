import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MemoryCardItem } from './utils';

type MemoryCardProps = {
  card: MemoryCardItem;
  size: number;
  onPress: () => void;
  disabled?: boolean;
};

export const MemoryCard = ({ card, size, onPress, disabled }: MemoryCardProps) => {
  const showFront = card.isFlipped || card.isMatched;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || card.isMatched}
      style={[styles.card, { width: size, height: size }, card.isMatched ? styles.matched : null]}
      accessibilityRole="button"
      accessibilityLabel={showFront ? 'Face up card' : 'Face down card'}
    >
      {showFront ? (
        <Image source={card.imageSrc} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.back}>
          <Text style={styles.backEmoji}>🐮</Text>
          <Text style={styles.backText}>STRATOS</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.28)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  matched: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  back: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(233, 238, 255, 0.15)',
  },
  backEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  backText: {
    color: '#e9eeff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

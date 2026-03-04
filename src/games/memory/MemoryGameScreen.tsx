import React from 'react';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { MemoryBoard } from './MemoryBoard';
import { DEFAULT_PAIRS, formatTime, HARD_PAIRS } from './utils';
import { useMemoryGame } from './useMemoryGame';

export const MemoryGameScreen = () => {
  const {
    cards,
    pairs,
    moves,
    matches,
    won,
    isLocked,
    elapsedSeconds,
    bestTime,
    difficultyLabel,
    onCardPress,
    restart,
    shuffle,
    changeDifficulty,
  } = useMemoryGame();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Game</Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Time {formatTime(elapsedSeconds)}</Text>
          <Text style={styles.stat}>Pairs {matches}/{pairs}</Text>
          <Text style={styles.stat}>Moves {moves}</Text>
        </View>
      </View>

      <View style={styles.difficultyRow}>
        <Pressable
          style={[styles.diffButton, pairs === DEFAULT_PAIRS ? styles.diffButtonActive : null]}
          onPress={() => changeDifficulty(DEFAULT_PAIRS)}
        >
          <Text style={styles.diffButtonText}>Easy (6)</Text>
        </Pressable>
        <Pressable
          style={[styles.diffButton, pairs === HARD_PAIRS ? styles.diffButtonActive : null]}
          onPress={() => changeDifficulty(HARD_PAIRS)}
        >
          <Text style={styles.diffButtonText}>Hard (8)</Text>
        </Pressable>
      </View>

      <View style={styles.boardWrap}>
        <MemoryBoard cards={cards} pairs={pairs} onCardPress={onCardPress} disabled={isLocked || won} />
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.controlButton} onPress={() => restart()}>
          <Text style={styles.controlButtonText}>Restart</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={() => shuffle()}>
          <Text style={styles.controlButtonText}>Shuffle</Text>
        </Pressable>
      </View>

      <Modal transparent visible={won} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>You won</Text>
            <Text style={styles.modalText}>Time: {formatTime(elapsedSeconds)}</Text>
            <Text style={styles.modalText}>Moves: {moves}</Text>
            <Text style={styles.modalText}>
              Best ({difficultyLabel}): {bestTime !== null ? formatTime(bestTime) : '—'}
            </Text>
            <Pressable style={styles.modalButton} onPress={() => restart()}>
              <Text style={styles.modalButtonText}>Play again</Text>
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
    backgroundColor: '#0b1e61',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  title: {
    color: colors.brandText,
    fontSize: 28,
    fontWeight: '700',
  },
  statsRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stat: {
    color: colors.brandText,
    fontSize: 14,
    marginRight: 14,
    marginBottom: 4,
    fontWeight: '600',
  },
  difficultyRow: {
    paddingHorizontal: 18,
    marginTop: 8,
    flexDirection: 'row',
  },
  diffButton: {
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  diffButtonActive: {
    backgroundColor: 'rgba(233, 238, 255, 0.24)',
  },
  diffButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  boardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  controls: {
    paddingHorizontal: 18,
    paddingBottom: 16,
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
    fontSize: 24,
    fontWeight: '700',
    color: colors.brandText,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    color: 'rgba(233, 238, 255, 0.9)',
    marginBottom: 6,
  },
  modalButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(233, 238, 255, 0.18)',
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '700',
  },
});

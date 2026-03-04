import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { Board } from './Board';
import { formatTime } from './utils';
import { useFourInARow } from './useFourInARow';

export const FourInARowScreen = () => {
  const navigation = useNavigation<any>();
  const {
    board,
    currentPlayer,
    status,
    winner,
    winningCells,
    score,
    elapsedSeconds,
    dropInColumn,
    restartRound,
    resetMatch,
  } = useFourInARow();

  const statusLabel =
    status === 'won'
      ? `Player ${winner} wins!`
      : status === 'draw'
        ? 'Draw game'
        : `Player ${currentPlayer}'s turn`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Text style={styles.topBarButtonText}>Menu</Text>
        </Pressable>
        <Pressable
          style={styles.topBarButton}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate(routes.Tabs))}
        >
          <Text style={styles.topBarButtonText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Four in a Row</Text>
        <Text style={styles.subtitle}>{statusLabel}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Time {formatTime(elapsedSeconds)}</Text>
          <Text style={styles.stat}>P1 {score.p1}</Text>
          <Text style={styles.stat}>P2 {score.p2}</Text>
        </View>
      </View>

      <View style={styles.boardWrap}>
        <Board board={board} winningCells={winningCells} onDrop={dropInColumn} disabled={status === 'won' || status === 'draw'} />
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.controlButton} onPress={restartRound}>
          <Text style={styles.controlButtonText}>Restart round</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={resetMatch}>
          <Text style={styles.controlButtonText}>Reset match</Text>
        </Pressable>
      </View>

      <Modal transparent visible={status === 'won' || status === 'draw'} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{status === 'won' ? `Player ${winner} wins` : 'Draw'}</Text>
            <Text style={styles.modalText}>Round time: {formatTime(elapsedSeconds)}</Text>
            <Text style={styles.modalText}>Score: P1 {score.p1} - P2 {score.p2}</Text>
            <Pressable style={styles.modalButton} onPress={restartRound}>
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
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    color: colors.brandText,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: 'rgba(233, 238, 255, 0.85)',
    fontSize: 15,
    fontWeight: '600',
  },
  statsRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stat: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 14,
    marginBottom: 4,
  },
  boardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  controls: {
    paddingHorizontal: 16,
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
    color: colors.brandText,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalText: {
    color: 'rgba(233, 238, 255, 0.92)',
    fontSize: 15,
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

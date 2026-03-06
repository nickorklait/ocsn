import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { Board } from './Board';
import { useTicTacToe } from './useTicTacToe';

export const TicTacToeScreen = () => {
  const navigation = useNavigation<any>();
  const {
    board,
    playerMark,
    computerMark,
    currentTurn,
    isComputerTurn,
    score,
    outcome,
    roundFinished,
    play,
    playAgain,
    resetMatch,
    choosePlayerMark,
  } = useTicTacToe();

  const resultTitle = outcome.winner
    ? outcome.winner === playerMark
      ? 'You win'
      : 'Computer wins'
    : outcome.isDraw
      ? 'Draw'
      : '';

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
        <Text style={styles.title}>Tre på rad</Text>
        <Text style={styles.subtitle}>
          {isComputerTurn ? `Computer (${computerMark}) is thinking...` : `Your turn (${playerMark})`}
        </Text>
      </View>

      <View style={styles.symbolRow}>
        <Text style={styles.symbolLabel}>Choose your mark:</Text>
        <Pressable
          style={[styles.symbolButton, playerMark === 'O' ? styles.symbolButtonActive : null]}
          onPress={() => choosePlayerMark('O')}
        >
          <Text style={styles.symbolButtonText}>O</Text>
        </Pressable>
        <Pressable
          style={[styles.symbolButton, playerMark === 'X' ? styles.symbolButtonActive : null]}
          onPress={() => choosePlayerMark('X')}
        >
          <Text style={styles.symbolButtonText}>X</Text>
        </Pressable>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.scoreChip}>
          <Text style={styles.scoreText}>You {score.playerWins}</Text>
        </View>
        <View style={styles.scoreChip}>
          <Text style={styles.scoreText}>Computer {score.computerWins}</Text>
        </View>
        <View style={styles.scoreChip}>
          <Text style={styles.scoreText}>Draws {score.draws}</Text>
        </View>
      </View>

      <View style={styles.boardWrap}>
        <Board
          board={board}
          winningLine={outcome.winningLine}
          playerMark={playerMark}
          computerMark={computerMark}
          onPressCell={play}
          disabled={roundFinished || isComputerTurn}
        />
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.controlButton} onPress={playAgain}>
          <Text style={styles.controlButtonText}>Play Again</Text>
        </Pressable>
        <Pressable style={styles.controlButton} onPress={resetMatch}>
          <Text style={styles.controlButtonText}>Reset Match</Text>
        </Pressable>
      </View>

      <Modal visible={roundFinished} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{resultTitle}</Text>
            <Text style={styles.modalText}>
              {outcome.winner
                ? outcome.winner === playerMark
                  ? `Great round. You won as ${playerMark}.`
                  : `Computer won as ${computerMark}.`
                : 'No more moves left this round.'}
            </Text>
            <Pressable style={styles.modalButton} onPress={playAgain}>
              <Text style={styles.modalButtonText}>Play Again</Text>
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
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: 'rgba(233, 238, 255, 0.84)',
    fontSize: 14,
  },
  symbolRow: {
    paddingHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolLabel: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '600',
    marginRight: 8,
  },
  symbolButton: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.25)',
    backgroundColor: 'rgba(233, 238, 255, 0.12)',
  },
  symbolButtonActive: {
    backgroundColor: 'rgba(76, 201, 240, 0.24)',
    borderColor: 'rgba(76, 201, 240, 0.5)',
  },
  symbolButtonText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  scoreRow: {
    paddingHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scoreChip: {
    marginRight: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.22)',
    backgroundColor: 'rgba(233, 238, 255, 0.12)',
  },
  scoreText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  boardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
  },
  controlButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(233, 238, 255, 0.17)',
  },
  controlButtonText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(6, 13, 40, 0.74)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.22)',
    backgroundColor: '#132d85',
    padding: 20,
  },
  modalTitle: {
    color: colors.brandText,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalText: {
    color: 'rgba(233, 238, 255, 0.9)',
    fontSize: 15,
    marginBottom: 14,
  },
  modalButton: {
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(233, 238, 255, 0.2)',
  },
  modalButtonText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '700',
  },
});

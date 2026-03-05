import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { STRATOS_PIECES } from '../../assets/stratosImages';
import { colors } from '../../theme/colors';

type ResultModalProps = {
  visible: boolean;
  didWin: boolean;
  landedLabel: string | null;
  onPlayAgain: () => void;
};

export const ResultModal = ({ visible, didWin, landedLabel, onPlayAgain }: ResultModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View
          style={[styles.card, didWin ? styles.cardWin : styles.cardLose]}
          accessibilityLabel={didWin ? 'Win result' : 'Lose result'}
        >
          <View style={[styles.badgeWrap, didWin ? styles.badgeWin : styles.badgeLose]}>
            <Image
              source={didWin ? STRATOS_PIECES.p1 : STRATOS_PIECES.p2}
              style={styles.badgeImage}
              resizeMode="cover"
            />
            <Text style={styles.badgeText}>{didWin ? 'WIN' : 'TRY AGAIN'}</Text>
          </View>
          <Text style={styles.title}>{didWin ? 'You won!' : 'Not this time!'}</Text>
          <Text style={styles.text}>
            {didWin ? 'Pointer landed on a WIN segment.' : 'Pointer landed on a LOSE segment.'}
          </Text>
          <Text style={styles.resultLine}>
            Result: <Text style={didWin ? styles.resultWin : styles.resultLose}>{didWin ? 'WIN' : 'LOSE'}</Text>
          </Text>
          <Text style={styles.resultLine}>
            Landed on: <Text style={styles.resultValue}>{landedLabel || '—'}</Text>
          </Text>
          <Pressable
            style={styles.button}
            onPress={onPlayAgain}
            accessibilityRole="button"
            accessibilityLabel="Play again"
          >
            <Text style={styles.buttonText}>Play again</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 13, 40, 0.74)',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: '#132d85',
    padding: 20,
  },
  cardWin: {
    borderColor: 'rgba(76, 201, 240, 0.45)',
  },
  cardLose: {
    borderColor: 'rgba(233, 238, 255, 0.26)',
  },
  badgeWrap: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  badgeWin: {
    backgroundColor: 'rgba(76, 201, 240, 0.25)',
  },
  badgeLose: {
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  badgeImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    marginRight: 8,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: colors.brandText,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  text: {
    color: 'rgba(233, 238, 255, 0.9)',
    fontSize: 15,
    marginBottom: 10,
  },
  resultLine: {
    color: 'rgba(233, 238, 255, 0.9)',
    fontSize: 14,
    marginBottom: 4,
  },
  resultWin: {
    color: '#4cc9f0',
    fontWeight: '800',
  },
  resultLose: {
    color: '#f9c74f',
    fontWeight: '800',
  },
  resultValue: {
    color: '#ffffff',
    fontWeight: '700',
  },
  button: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(233, 238, 255, 0.18)',
  },
  buttonText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '700',
  },
});

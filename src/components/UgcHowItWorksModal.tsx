import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface UgcHowItWorksModalProps {
  visible: boolean;
  onClose: () => void;
}

const bullets = [
  'Post your Stratos moment with #StratosSmile.',
  'We review posts weekly and select favorites.',
  'Selected posts appear in this gallery.',
  'Always credit the original creator.',
];

export const UgcHowItWorksModal = ({ visible, onClose }: UgcHowItWorksModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Close modal">
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>How it works</Text>
          {bullets.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Text style={styles.bulletMark}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Got it</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 36, 0.64)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  sheet: {
    backgroundColor: '#10245f',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
  },
  title: {
    color: colors.brandText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletMark: {
    color: colors.brandText,
    marginRight: 8,
    fontSize: 16,
  },
  bulletText: {
    color: colors.brandText,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  closeButtonText: {
    color: colors.brandText,
    fontWeight: '700',
    fontSize: 13,
  },
});


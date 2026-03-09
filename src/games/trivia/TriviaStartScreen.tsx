import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

interface TriviaStartScreenProps {
  onStart: () => void;
}

export const TriviaStartScreen = ({ onStart }: TriviaStartScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Stratos Trivia</Text>
        <Text style={styles.subtitle}>A short and playful chocolate quiz. One question at a time.</Text>
        <Pressable style={styles.button} onPress={onStart} accessibilityRole="button">
          <Text style={styles.buttonText}>Start Trivia</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(16, 36, 95, 0.9)',
    padding: 20,
  },
  title: {
    color: colors.brandText,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: 'rgba(233, 238, 255, 0.9)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#4cc9f0',
  },
  buttonText: {
    color: '#062562',
    fontWeight: '800',
    fontSize: 16,
  },
});

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { Leaderboard } from './Leaderboard';
import { TriviaLeaderboardEntry } from './types';

interface TriviaResultScreenProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  leaderboard: TriviaLeaderboardEntry[];
  leaderboardLoading: boolean;
  onPlayAgain: () => void;
}

export const TriviaResultScreen = ({
  score,
  correctAnswers,
  totalQuestions,
  leaderboard,
  leaderboardLoading,
  onPlayAgain,
}: TriviaResultScreenProps) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.title}>Trivia Complete</Text>
        <Text style={styles.score}>{score} points</Text>
        <Text style={styles.meta}>
          {correctAnswers} of {totalQuestions} correct ({percentage}%)
        </Text>
        <Pressable style={styles.button} onPress={onPlayAgain} accessibilityRole="button">
          <Text style={styles.buttonText}>Play Again</Text>
        </Pressable>
      </View>

      <Leaderboard entries={leaderboard} loading={leaderboardLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  summaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(16, 36, 95, 0.9)',
    padding: 18,
  },
  title: {
    color: colors.brandText,
    fontSize: 24,
    fontWeight: '800',
  },
  score: {
    marginTop: 8,
    color: '#4cc9f0',
    fontSize: 30,
    fontWeight: '900',
  },
  meta: {
    marginTop: 4,
    color: 'rgba(233, 238, 255, 0.9)',
    fontSize: 14,
  },
  button: {
    marginTop: 14,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#4cc9f0',
  },
  buttonText: {
    color: '#062562',
    fontWeight: '800',
    fontSize: 15,
  },
});

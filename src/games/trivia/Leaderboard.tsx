import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TriviaLeaderboardEntry } from './types';
import { colors } from '../../theme/colors';

interface LeaderboardProps {
  entries: TriviaLeaderboardEntry[];
  loading: boolean;
}

const formatDate = (dateIso: string) => {
  const date = new Date(dateIso);
  return date.toLocaleDateString();
};

export const Leaderboard = ({ entries, loading }: LeaderboardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Leaderboard</Text>
      {loading ? <Text style={styles.emptyText}>Loading scores...</Text> : null}
      {!loading && entries.length === 0 ? <Text style={styles.emptyText}>No scores yet. Be first!</Text> : null}
      {!loading &&
        entries.map((entry, index) => (
          <View key={entry.id} style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={styles.rowMeta}>
              <Text style={styles.score}>{entry.score} pts</Text>
              <Text style={styles.detail}>
                {entry.correctAnswers}/{entry.totalQuestions} correct ({entry.percentage}%)
              </Text>
            </View>
            <Text style={styles.date}>{formatDate(entry.dateIso)}</Text>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(16, 36, 95, 0.9)',
    padding: 14,
  },
  title: {
    color: colors.brandText,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: 'rgba(233, 238, 255, 0.82)',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: 'rgba(233, 238, 255, 0.12)',
  },
  rank: {
    width: 34,
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '800',
  },
  rowMeta: {
    flex: 1,
  },
  score: {
    color: '#4cc9f0',
    fontSize: 14,
    fontWeight: '800',
  },
  detail: {
    color: 'rgba(233, 238, 255, 0.84)',
    fontSize: 12,
  },
  date: {
    color: 'rgba(233, 238, 255, 0.72)',
    fontSize: 11,
  },
});

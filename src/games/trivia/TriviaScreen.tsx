import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { TriviaQuestionCard } from './TriviaQuestionCard';
import { TriviaResultScreen } from './TriviaResultScreen';
import { TriviaStartScreen } from './TriviaStartScreen';
import { useTriviaGame } from './useTriviaGame';

export const TriviaScreen = () => {
  const navigation = useNavigation<any>();
  const {
    phase,
    currentQuestion,
    score,
    correctAnswers,
    totalQuestions,
    feedback,
    progressLabel,
    leaderboard,
    leaderboardLoading,
    startGame,
    answerQuestion,
    playAgain,
  } = useTriviaGame();

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
        <Text style={styles.title}>Stratos Trivia</Text>
      </View>

      {phase === 'start' ? <TriviaStartScreen onStart={startGame} /> : null}

      {phase === 'question' && currentQuestion ? (
        <ScrollView contentContainerStyle={styles.questionWrap}>
          <TriviaQuestionCard
            question={currentQuestion}
            progressLabel={progressLabel}
            score={score}
            feedback={feedback}
            onSelectOption={answerQuestion}
          />
        </ScrollView>
      ) : null}

      {phase === 'result' ? (
        <ScrollView contentContainerStyle={styles.resultWrap}>
          <TriviaResultScreen
            score={score}
            correctAnswers={correctAnswers}
            totalQuestions={totalQuestions}
            leaderboard={leaderboard}
            leaderboardLoading={leaderboardLoading}
            onPlayAgain={playAgain}
          />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1e61',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    color: colors.brandText,
    fontSize: 28,
    fontWeight: '700',
  },
  questionWrap: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 22,
  },
  resultWrap: {
    paddingTop: 8,
  },
});

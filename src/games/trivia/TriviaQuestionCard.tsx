import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { TriviaFeedback, TriviaQuestion } from './types';

interface TriviaQuestionCardProps {
  question: TriviaQuestion;
  progressLabel: string;
  score: number;
  feedback: TriviaFeedback | null;
  onSelectOption: (index: number) => void;
}

export const TriviaQuestionCard = ({
  question,
  progressLabel,
  score,
  feedback,
  onSelectOption,
}: TriviaQuestionCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.metaRow}>
        <Text style={styles.progressText}>{progressLabel}</Text>
        <Text style={styles.scoreText}>{score} pts</Text>
      </View>
      <Text style={styles.questionText}>{question.question}</Text>

      <View style={styles.optionsWrap}>
        {question.options.map((option, index) => {
          const isSelected = feedback?.selectedOptionIndex === index;
          const isCorrect = feedback?.correctOptionIndex === index;
          return (
            <Pressable
              key={option}
              onPress={() => onSelectOption(index)}
              disabled={Boolean(feedback)}
              style={[
                styles.optionButton,
                isSelected ? styles.selectedOption : null,
                feedback && isCorrect ? styles.correctOption : null,
                feedback && isSelected && !feedback.isCorrect ? styles.wrongOption : null,
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      {feedback ? (
        <Text style={styles.feedbackText}>
          {feedback.isCorrect ? `Correct ✅ +${feedback.pointsAwarded} points` : 'Wrong ❌'}
        </Text>
      ) : null}

      {question.note ? <Text style={styles.noteText}>{question.note}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(16, 36, 95, 0.9)',
    padding: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: 'rgba(233, 238, 255, 0.85)',
    fontSize: 13,
    fontWeight: '700',
  },
  scoreText: {
    color: '#4cc9f0',
    fontSize: 14,
    fontWeight: '800',
  },
  questionText: {
    marginTop: 10,
    color: colors.brandText,
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 30,
  },
  optionsWrap: {
    marginTop: 16,
    gap: 9,
  },
  optionButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.24)',
    backgroundColor: 'rgba(233, 238, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectedOption: {
    borderColor: '#7fdfff',
  },
  correctOption: {
    backgroundColor: 'rgba(62, 214, 147, 0.24)',
    borderColor: 'rgba(62, 214, 147, 0.9)',
  },
  wrongOption: {
    backgroundColor: 'rgba(239, 71, 111, 0.24)',
    borderColor: 'rgba(239, 71, 111, 0.9)',
  },
  optionText: {
    color: colors.brandText,
    fontSize: 15,
    fontWeight: '600',
  },
  feedbackText: {
    marginTop: 14,
    color: colors.brandText,
    fontSize: 15,
    fontWeight: '800',
  },
  noteText: {
    marginTop: 6,
    color: 'rgba(233, 238, 255, 0.78)',
    fontSize: 12,
  },
});

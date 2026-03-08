import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ingredient } from './ingredients';
import { colors } from '../../theme/colors';

interface IngredientChipProps {
  ingredient: Ingredient;
  selected: boolean;
  onPress: () => void;
}

export const IngredientChip = ({ ingredient, selected, onPress }: IngredientChipProps) => {
  return (
    <Pressable
      style={[
        styles.chip,
        selected ? styles.selectedChip : null,
        selected ? { borderColor: ingredient.accent } : null,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${selected ? 'Remove' : 'Add'} ${ingredient.label}`}
    >
      <Text style={[styles.chipText, selected ? styles.selectedChipText : null]}>{ingredient.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.28)',
    backgroundColor: 'rgba(233, 238, 255, 0.1)',
  },
  selectedChip: {
    backgroundColor: '#ffffff',
  },
  chipText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  selectedChipText: {
    color: '#0b1e61',
  },
});

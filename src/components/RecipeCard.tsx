import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Recipe } from '../data/recipes/types';
import { colors } from '../theme/colors';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, onPress }: RecipeCardProps) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress(recipe)}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{recipe.timeLabel}</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={1}>
        {recipe.shortDescription}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.22)',
    borderRadius: 16,
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
    padding: 16,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.brandText,
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.16)',
  },
  badgeText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: colors.brandText,
    opacity: 0.9,
    marginTop: 8,
    fontSize: 14,
  },
});

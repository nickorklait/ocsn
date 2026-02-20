import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RecipeCard } from '../components/RecipeCard';
import { recipes } from '../data/recipes/recipes';
import { Recipe } from '../data/recipes/types';
import { RecipesStackParamList } from '../navigation/routes';
import { colors } from '../theme/colors';

type RecipesScreenProps = NativeStackScreenProps<RecipesStackParamList, 'Recipes'>;

export const RecipesScreen = ({ navigation }: RecipesScreenProps) => {
  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <RecipeCard
          recipe={item}
          onPress={(recipe) => navigation.navigate('RecipeDetails', { recipeId: recipe.id })}
        />
      )}
      ListHeaderComponent={
        <Text style={styles.header}>30-second recipes designed for fast wins.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.brandBackground,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    color: colors.brandText,
    fontSize: 15,
    opacity: 0.85,
    marginBottom: 12,
  },
});

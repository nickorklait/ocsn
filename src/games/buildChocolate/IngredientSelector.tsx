import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ingredient, IngredientId } from './ingredients';
import { IngredientChip } from './IngredientChip';

interface IngredientSelectorProps {
  ingredients: readonly Ingredient[];
  selectedIngredients: IngredientId[];
  onToggleIngredient: (ingredientId: IngredientId) => void;
}

export const IngredientSelector = ({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
}: IngredientSelectorProps) => {
  return (
    <View style={styles.container}>
      {ingredients.map((ingredient) => (
        <View key={ingredient.id} style={styles.item}>
          <IngredientChip
            ingredient={ingredient}
            selected={selectedIngredients.includes(ingredient.id)}
            onPress={() => onToggleIngredient(ingredient.id)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  item: {
    marginHorizontal: 4,
    marginVertical: 5,
  },
});

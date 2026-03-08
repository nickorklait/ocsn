import { useMemo, useState } from 'react';
import { INGREDIENTS, IngredientId } from './ingredients';

const formatList = (items: string[]) => {
  if (items.length === 0) {
    return 'just smooth chocolate';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
};

export const useChocolateBuilder = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<IngredientId[]>([]);
  const [customToppings, setCustomToppings] = useState<string[]>([]);

  const toggleIngredient = (ingredientId: IngredientId) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const randomizeChocolate = () => {
    const shuffled = [...INGREDIENTS].sort(() => Math.random() - 0.5);
    const count = 1 + Math.floor(Math.random() * INGREDIENTS.length);
    setSelectedIngredients(shuffled.slice(0, count).map((ingredient) => ingredient.id));
  };

  const addCustomTopping = (label: string) => {
    const normalized = label.trim().replace(/\s+/g, ' ');
    if (!normalized) {
      return false;
    }

    setCustomToppings((prev) => {
      const alreadyExists = prev.some((item) => item.toLowerCase() === normalized.toLowerCase());
      if (alreadyExists) {
        return prev;
      }
      return [...prev, normalized];
    });

    return true;
  };

  const removeCustomTopping = (label: string) => {
    setCustomToppings((prev) => prev.filter((item) => item !== label));
  };

  const selectedLabels = useMemo(
    () => [
      ...INGREDIENTS.filter((ingredient) => selectedIngredients.includes(ingredient.id)).map((ingredient) =>
        ingredient.label.toLowerCase()
      ),
      ...customToppings.map((item) => item.toLowerCase()),
    ],
    [customToppings, selectedIngredients]
  );

  const shareText = useMemo(
    () => `My dream Stratos chocolate has: ${formatList(selectedLabels)} 🍫`,
    [selectedLabels]
  );

  return {
    ingredients: INGREDIENTS,
    selectedIngredients,
    customToppings,
    toggleIngredient,
    randomizeChocolate,
    addCustomTopping,
    removeCustomTopping,
    shareText,
  };
};

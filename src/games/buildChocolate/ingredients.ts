export const INGREDIENTS = [
  {
    id: 'nuts',
    label: 'Nuts',
    color: '#d7b38c',
    accent: '#b98d63',
    layer: 'chips',
  },
  {
    id: 'caramel',
    label: 'Caramel',
    color: '#d29342',
    accent: '#b0722e',
    layer: 'drizzle',
  },
  {
    id: 'bubbles',
    label: 'Extra Bubbles',
    color: '#a9d8ff',
    accent: '#78bee9',
    layer: 'bubbles',
  },
  {
    id: 'cookies',
    label: 'Cookie Pieces',
    color: '#be996f',
    accent: '#8f6d49',
    layer: 'chunks',
  },
  {
    id: 'marshmallow',
    label: 'Marshmallow',
    color: '#fff6fb',
    accent: '#e9e0f0',
    layer: 'puffs',
  },
  {
    id: 'sprinkles',
    label: 'Sprinkles',
    color: '#ff7a9f',
    accent: '#6ee6ff',
    layer: 'sprinkles',
  },
] as const;

export type Ingredient = (typeof INGREDIENTS)[number];
export type IngredientId = Ingredient['id'];

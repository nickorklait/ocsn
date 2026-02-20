import { Product } from '../products/types';
import { RecipeProductRef } from './types';

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string) =>
  normalizeText(value)
    .split(' ')
    .filter((token) => token.length > 1 && token !== 'stratos');

const containsAllTokens = (haystack: string, needle: string) => {
  const hay = normalizeText(haystack);
  const tokens = tokenize(needle);
  return tokens.length > 0 && tokens.every((token) => hay.includes(token));
};

const containsAnyToken = (haystack: string, needle: string) => {
  const hay = normalizeText(haystack);
  const tokens = tokenize(needle);
  return tokens.length > 0 && tokens.some((token) => hay.includes(token));
};

export const linkProducts = (products: Product[], refs: RecipeProductRef[]) => {
  return refs.map((ref) => {
    if (ref.type === 'erp') {
      const match = products.find(
        (product) => normalizeText(product.masterErpNumber || '') === normalizeText(ref.value)
      );
      return { ref, product: match || null };
    }

    const match =
      products.find((product) => containsAllTokens(product.name, ref.value)) ||
      products.find((product) => containsAllTokens(product.description, ref.value)) ||
      products.find((product) => containsAllTokens(product.ingredients, ref.value)) ||
      products.find((product) => containsAnyToken(product.name, ref.value)) ||
      products.find((product) => containsAnyToken(product.description, ref.value)) ||
      products.find((product) => containsAnyToken(product.ingredients, ref.value));
    return { ref, product: match || null };
  });
};

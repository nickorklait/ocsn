import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Product } from '../data/products/types';
import { colors } from '../theme/colors';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const { width } = useWindowDimensions();
  const imageHeight = Math.min(160, Math.max(110, Math.round((width - 32) * 0.42)));

  return (
    <Pressable style={styles.card} onPress={() => onPress(product)}>
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={[styles.image, { height: imageHeight }]}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder, { height: imageHeight }]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.textWrap}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {product.description}
        </Text>
        <Text style={styles.ingredients} numberOfLines={2}>
          Ingredients: {product.ingredients}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.22)',
    borderRadius: 14,
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
    marginBottom: 14,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: colors.brandText,
    opacity: 0.75,
    fontWeight: '600',
  },
  textWrap: {
    padding: 14,
  },
  name: {
    color: colors.brandText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: colors.brandText,
    opacity: 0.95,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 8,
  },
  ingredients: {
    color: colors.brandText,
    opacity: 0.82,
    fontSize: 13,
    lineHeight: 18,
  },
});

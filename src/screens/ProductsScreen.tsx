import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { loadProducts } from '../data/products/xmlProducts';
import { Product } from '../data/products/types';
import { colors } from '../theme/colors';

interface ProductsScreenProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductsScreen = ({ onSelectProduct }: ProductsScreenProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const parsedProducts = await loadProducts();
      setProducts(parsedProducts);
    } catch (error) {
      setErrorMessage('Could not load products.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator size="large" color={colors.brandText} />
        <Text style={styles.stateText}>Loading products...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centeredState}>
        <Text style={styles.stateText}>{errorMessage}</Text>
        <Pressable style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={onSelectProduct} />
      )}
      ListEmptyComponent={
        <Text style={styles.stateText}>No active Stratos products found.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  stateText: {
    marginTop: 12,
    color: colors.brandText,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 14,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: 'rgba(233, 238, 255, 0.16)',
  },
  retryButtonText: {
    color: colors.brandText,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
});


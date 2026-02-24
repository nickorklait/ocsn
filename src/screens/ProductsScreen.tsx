import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductCard } from '../components/ProductCard';
import { getProductsDiagnostics, loadProducts } from '../data/products/xmlProducts';
import { Product } from '../data/products/types';
import { ProductsStackParamList } from '../navigation/routes';
import { colors } from '../theme/colors';

type ProductsScreenProps = NativeStackScreenProps<ProductsStackParamList, 'Products'>;

export const ProductsScreen = ({ navigation }: ProductsScreenProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState(getProductsDiagnostics());

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const parsedProducts = await loadProducts();
      setProducts(parsedProducts);
      setDiagnostics(getProductsDiagnostics());
    } catch (error) {
      setErrorMessage('Could not load products.');
      setDiagnostics(getProductsDiagnostics());
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
        {diagnostics.lastError ? (
          <Text style={styles.errorDetail}>{diagnostics.lastError}</Text>
        ) : null}
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
      style={styles.list}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={(product) => navigation.navigate('ProductDetails', { product })}
        />
      )}
      ListEmptyComponent={
        <Text style={styles.stateText}>
          {diagnostics.lastError
            ? 'Products unavailable right now.'
            : 'No active Stratos products found.'}
        </Text>
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
    backgroundColor: colors.brandBackground,
  },
  list: {
    backgroundColor: colors.brandBackground,
  },
  stateText: {
    marginTop: 12,
    color: colors.brandText,
    fontSize: 16,
    textAlign: 'center',
  },
  errorDetail: {
    marginTop: 8,
    color: colors.brandText,
    fontSize: 12,
    opacity: 0.7,
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


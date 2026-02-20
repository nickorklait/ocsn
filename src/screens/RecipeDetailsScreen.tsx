import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { recipes } from '../data/recipes/recipes';
import { linkProducts } from '../data/recipes/linkProducts';
import { Recipe } from '../data/recipes/types';
import { loadProducts } from '../data/products/xmlProducts';
import { Product } from '../data/products/types';
import { colors } from '../theme/colors';
import { ProductChip } from '../components/ProductChip';
import { RecipesStackParamList } from '../navigation/routes';

type ScreenProps = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetails'>;

export const RecipeDetailsScreen = ({ route, navigation }: ScreenProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const recipe = useMemo(
    () => recipes.find((item) => item.id === route.params.recipeId),
    [route.params.recipeId]
  );

  useEffect(() => {
    let mounted = true;
    loadProducts()
      .then((items) => {
        if (mounted) {
          setProducts(items);
          setIsLoadingProducts(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setProducts([]);
          setIsLoadingProducts(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!recipe) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.title}>Recipe not found</Text>
        <Text style={styles.body}>Please go back and pick another recipe.</Text>
      </View>
    );
  }

  const linkedProducts = linkProducts(products, recipe.productRefs);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Recipes</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{recipe.timeLabel}</Text>
        </View>
      </View>

      <Text style={styles.body}>{recipe.shortDescription}</Text>

      <Text style={styles.sectionTitle}>Steps</Text>
      {recipe.steps.map((step, index) => (
        <View key={`${recipe.id}-step-${index}`} style={styles.stepRow}>
          <Text style={styles.stepBullet}>•</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      {recipe.tip ? (
        <View style={styles.tipBox}>
          <Text style={styles.tipLabel}>Tip</Text>
          <Text style={styles.tipText}>{recipe.tip}</Text>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Products used</Text>
      {isLoadingProducts ? (
        <Text style={styles.body}>Loading products...</Text>
      ) : null}
      <View style={styles.chipRow}>
        {linkedProducts.map(({ ref, product }) => (
          <ProductChip
            key={`${recipe.id}-${ref.value}`}
            label={product ? product.name : `${ref.value} (not found)`}
            disabled={!product}
            onPress={
              product
                ? () => navigation.navigate('ProductDetails', { product })
                : undefined
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: colors.brandBackground,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.brandBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
    marginBottom: 12,
  },
  backButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    color: colors.brandText,
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
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
  body: {
    color: colors.brandText,
    fontSize: 16,
    lineHeight: 23,
    opacity: 0.9,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    opacity: 0.85,
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepBullet: {
    color: colors.brandText,
    marginRight: 8,
    fontSize: 16,
  },
  stepText: {
    color: colors.brandText,
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
  },
  tipBox: {
    marginTop: 12,
    marginBottom: 18,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
  },
  tipLabel: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  tipText: {
    color: colors.brandText,
    fontSize: 15,
    lineHeight: 21,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProductDetailsParams } from '../navigation/routes';
import { colors } from '../theme/colors';

type ProductDetailsProps = NativeStackScreenProps<
  { ProductDetails: ProductDetailsParams },
  'ProductDetails'
>;

export const ProductDetailsScreen = ({ route, navigation }: ProductDetailsProps) => {
  const { product } = route.params;
  const { width } = useWindowDimensions();
  const imageHeight = Math.min(200, Math.max(130, Math.round((width - 32) * 0.56)));

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Products</Text>
      </Pressable>

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

      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.body}>{product.description}</Text>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      <Text style={styles.body}>{product.ingredients}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 30,
    backgroundColor: colors.brandBackground,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
    marginBottom: 12,
  },
  backButtonText: {
    color: colors.brandText,
    fontWeight: '700',
  },
  image: {
    width: '100%',
    borderRadius: 12,
    marginBottom: 14,
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
  name: {
    color: colors.brandText,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    opacity: 0.85,
    marginBottom: 4,
  },
  body: {
    color: colors.brandText,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 12,
  },
});

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { INGREDIENTS, Ingredient, IngredientId } from './ingredients';
import { colors } from '../../theme/colors';

interface ChocolatePreviewProps {
  selectedIngredients: IngredientId[];
  customToppings?: string[];
}

const PIECE_POSITIONS = [
  { top: '14%', left: '10%' },
  { top: '18%', left: '23%' },
  { top: '12%', left: '38%' },
  { top: '21%', left: '53%' },
  { top: '17%', left: '69%' },
  { top: '33%', left: '14%' },
  { top: '40%', left: '29%' },
  { top: '31%', left: '46%' },
  { top: '41%', left: '62%' },
  { top: '35%', left: '78%' },
  { top: '57%', left: '17%' },
  { top: '54%', left: '34%' },
  { top: '62%', left: '51%' },
  { top: '56%', left: '67%' },
  { top: '63%', left: '82%' },
] as const;

const CARAMEL_ROWS = ['22%', '33%', '44%', '55%', '66%'] as const;

const IngredientLayer = ({ ingredient }: { ingredient: Ingredient }) => {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animated]);

  const animatedStyle = {
    opacity: animated,
    transform: [{ scale: animated.interpolate({ inputRange: [0, 1], outputRange: [0.84, 1] }) }],
  };

  if (ingredient.layer === 'drizzle') {
    return (
      <Animated.View style={[styles.layerWrap, animatedStyle]}>
        {CARAMEL_ROWS.map((top, index) => (
          <View
            key={`${ingredient.id}-caramel-${top}`}
            style={[
              styles.caramelLine,
              {
                top,
                borderColor: ingredient.accent,
                backgroundColor: ingredient.color,
                width: index % 2 === 0 ? '76%' : '72%',
                left: index % 2 === 0 ? '12%' : '14%',
              },
            ]}
          >
            <View style={[styles.caramelShine, { backgroundColor: 'rgba(255, 228, 177, 0.35)' }]} />
            {index % 2 === 0 ? <View style={[styles.caramelDrop, { backgroundColor: ingredient.color }]} /> : null}
          </View>
        ))}
      </Animated.View>
    );
  }

  if (ingredient.layer === 'sprinkles') {
    return (
      <Animated.View style={[styles.layerWrap, animatedStyle]}>
        {PIECE_POSITIONS.map((position, index) => (
          <View
            key={`${ingredient.id}-sprinkle-${position.top}-${position.left}`}
            style={[
              styles.sprinkle,
              {
                top: position.top,
                left: position.left,
                backgroundColor: index % 3 === 0 ? ingredient.color : ingredient.accent,
                transform: [{ rotate: index % 2 === 0 ? '27deg' : '-27deg' }],
              },
            ]}
          />
        ))}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.layerWrap, animatedStyle]}>
      {PIECE_POSITIONS.map((position, index) => (
        <View key={`${ingredient.id}-${position.top}-${position.left}`} style={{ top: position.top, left: position.left }}>
          {ingredient.layer === 'chips' ? (
            <View
              style={[
                styles.nutPiece,
                {
                  backgroundColor: ingredient.color,
                  borderColor: ingredient.accent,
                  transform: [{ rotate: index % 2 === 0 ? '18deg' : '-12deg' }],
                },
              ]}
            >
              <View style={styles.nutHighlight} />
            </View>
          ) : null}

          {ingredient.layer === 'bubbles' ? (
            <View
              style={[
                styles.bubbleRing,
                {
                  borderColor: ingredient.accent,
                  backgroundColor: 'rgba(169, 216, 255, 0.18)',
                  width: index % 3 === 0 ? 18 : 14,
                  height: index % 3 === 0 ? 18 : 14,
                  borderRadius: index % 3 === 0 ? 9 : 7,
                },
              ]}
            >
              <View style={styles.bubbleShine} />
            </View>
          ) : null}

          {ingredient.layer === 'chunks' ? (
            <View
              style={[
                styles.cookiePiece,
                {
                  backgroundColor: ingredient.color,
                  borderColor: ingredient.accent,
                  transform: [{ rotate: index % 3 === 0 ? '24deg' : '-14deg' }],
                },
              ]}
            >
              <View style={styles.cookieDot} />
              <View style={[styles.cookieDot, styles.cookieDotSmall]} />
            </View>
          ) : null}

          {ingredient.layer === 'puffs' ? (
            <View
              style={[
                styles.marshmallow,
                {
                  backgroundColor: ingredient.color,
                  borderColor: ingredient.accent,
                  transform: [{ rotate: index % 2 === 0 ? '12deg' : '-10deg' }],
                },
              ]}
            >
              <View style={styles.marshmallowShine} />
            </View>
          ) : null}
        </View>
      ))}
    </Animated.View>
  );
};

export const ChocolatePreview = ({ selectedIngredients, customToppings = [] }: ChocolatePreviewProps) => {
  const selected = INGREDIENTS.filter((ingredient) => selectedIngredients.includes(ingredient.id));
  const totalCount = selected.length + customToppings.length;

  return (
    <View style={styles.container}>
      <View style={styles.backdropGlow} />
      <View style={styles.shadow} />

      <View style={styles.barFrame}>
        <View style={styles.bar}>
          <View style={styles.baseGrid}>
            {Array.from({ length: 12 }).map((_, index) => (
              <View key={`tile-${index}`} style={styles.baseTile} />
            ))}
          </View>
          <View style={styles.gloss} />
          <View style={styles.edgeShade} />
          {selected.map((ingredient) => (
            <IngredientLayer key={ingredient.id} ingredient={ingredient} />
          ))}
        </View>
      </View>

      {customToppings.length > 0 ? (
        <View style={styles.customWrap}>
          {customToppings.map((label) => (
            <View key={label} style={styles.customTag}>
              <Text style={styles.customTagText}>{label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text style={styles.helperText}>
        {totalCount === 0 ? 'Pick toppings or add your own wishlist topping.' : `${totalCount} toppings selected`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10,
  },
  backdropGlow: {
    position: 'absolute',
    top: -10,
    width: 320,
    height: 210,
    borderRadius: 26,
    backgroundColor: 'rgba(76, 201, 240, 0.08)',
  },
  shadow: {
    position: 'absolute',
    top: 152,
    width: 300,
    height: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(2, 6, 24, 0.5)',
  },
  barFrame: {
    padding: 8,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    backgroundColor: 'rgba(4, 12, 43, 0.34)',
  },
  bar: {
    width: 304,
    height: 170,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#6d3d20',
    backgroundColor: '#774325',
    overflow: 'hidden',
  },
  baseGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 9,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  baseTile: {
    width: '23%',
    height: '29.5%',
    borderRadius: 8,
    backgroundColor: '#693a20',
    borderWidth: 1,
    borderColor: '#4e2c18',
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 46,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(255, 244, 228, 0.07)',
  },
  edgeShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 28,
    backgroundColor: 'rgba(48, 20, 8, 0.2)',
  },
  layerWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  nutPiece: {
    width: 14,
    height: 12,
    borderRadius: 5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  nutHighlight: {
    position: 'absolute',
    top: 1,
    left: 2,
    width: 7,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  caramelLine: {
    position: 'absolute',
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
  },
  caramelShine: {
    marginLeft: 8,
    width: '26%',
    height: 2,
    borderRadius: 2,
  },
  caramelDrop: {
    position: 'absolute',
    right: 20,
    top: 6,
    width: 5,
    height: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  bubbleRing: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleShine: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  cookiePiece: {
    width: 15,
    height: 11,
    borderRadius: 3,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cookieDot: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#6f4a2f',
  },
  cookieDotSmall: {
    left: 9,
    top: 5,
    width: 2,
    height: 2,
  },
  marshmallow: {
    width: 15,
    height: 11,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  marshmallowShine: {
    position: 'absolute',
    top: 1,
    left: 2,
    width: 7,
    height: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.56)',
  },
  sprinkle: {
    position: 'absolute',
    width: 10,
    height: 4,
    borderRadius: 2,
  },
  customWrap: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 320,
  },
  customTag: {
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  customTagText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  helperText: {
    marginTop: 10,
    color: colors.brandText,
    fontSize: 13,
    opacity: 0.9,
  },
});

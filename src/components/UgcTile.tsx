import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { UgcPost } from '../data/ugc/types';
import { colors } from '../theme/colors';

interface UgcTileProps {
  post: UgcPost;
  onPress: (post: UgcPost) => void;
}

export const UgcTile = ({ post, onPress }: UgcTileProps) => {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onPress(post)}
      accessibilityLabel={`Open post by ${post.authorName}`}
    >
      <Image source={post.imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.captionArea}>
        <Text style={styles.caption} numberOfLines={2}>
          {post.caption}
        </Text>
        <Text style={styles.meta}>
          {post.authorName} · {new Date(post.date).toLocaleDateString()}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.18)',
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  captionArea: {
    padding: 10,
  },
  caption: {
    color: colors.brandText,
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    marginTop: 6,
    color: colors.brandText,
    fontSize: 11,
    opacity: 0.7,
  },
});

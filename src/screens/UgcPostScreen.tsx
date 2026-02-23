import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { curatedPosts } from '../data/ugc/curatedPosts';
import { UgcStackParamList } from '../navigation/routes';
import { colors } from '../theme/colors';

type ScreenProps = NativeStackScreenProps<UgcStackParamList, 'UgcPost'>;

export const UgcPostScreen = ({ route, navigation }: ScreenProps) => {
  const post = curatedPosts.find((item) => item.id === route.params.postId);

  if (!post) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.title}>Post not found</Text>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Gallery</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <Pressable style={styles.topBarButton} onPress={() => navigation.goBack()}>
          <Text style={styles.topBarText}>Back</Text>
        </Pressable>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
        >
          <Text style={styles.topBarText}>Menu</Text>
        </Pressable>
      </View>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Gallery</Text>
      </Pressable>

      <Image source={post.imageSource} style={styles.image} resizeMode="cover" />
      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.meta}>
        {post.authorName} · {new Date(post.date).toLocaleDateString()} · {post.platform}
      </Text>

      <Pressable
        style={styles.linkButton}
        onPress={() => Linking.openURL(post.sourceUrl)}
        accessibilityLabel="Open source link"
      >
        <Text style={styles.linkButtonText}>Open source post</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    backgroundColor: colors.brandBackground,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.brandBackground,
  },
  title: {
    color: colors.brandText,
    fontSize: 20,
    fontWeight: '700',
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  topBarButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.12)',
  },
  topBarText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  caption: {
    color: colors.brandText,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 8,
  },
  meta: {
    color: colors.brandText,
    fontSize: 12,
    opacity: 0.75,
    marginBottom: 14,
  },
  linkButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.12)',
  },
  linkButtonText: {
    color: colors.brandText,
    fontWeight: '700',
    fontSize: 13,
  },
});

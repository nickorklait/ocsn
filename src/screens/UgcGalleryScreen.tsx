import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { curatedPosts } from '../data/ugc/curatedPosts';
import { UgcPost } from '../data/ugc/types';
import { UgcTile } from '../components/UgcTile';
import { UgcHowItWorksModal } from '../components/UgcHowItWorksModal';
import { UgcStackParamList } from '../navigation/routes';
import { colors } from '../theme/colors';

type ScreenProps = NativeStackScreenProps<UgcStackParamList, 'UgcGallery'>;

export const UgcGalleryScreen = ({ navigation }: ScreenProps) => {
  const { width } = useWindowDimensions();
  const [showHow, setShowHow] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const columns = width >= 900 ? 3 : 2;
  const data = useMemo(() => curatedPosts, []);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Back"
        >
          <Text style={styles.topBarText}>Back</Text>
        </Pressable>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.getParent()?.dispatch(DrawerActions.openDrawer())}
          accessibilityLabel="Open menu"
        >
          <Text style={styles.topBarText}>Menu</Text>
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Share a Smile, Join the Herd</Text>
        <Text style={styles.subtitle}>
          Post your Stratos moment with #StratosSmile. We’ll feature selected posts here.
        </Text>
        <Pressable
          style={styles.howButton}
          onPress={() => setShowHow(true)}
          accessibilityLabel="How it works"
        >
          <Text style={styles.howButtonText}>How it works</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.brandText} />
          <Text style={styles.loadingText}>Loading gallery...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          key={columns}
          numColumns={columns}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={columns > 1 ? styles.columnWrap : undefined}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.tileWrap}>
              <UgcTile
                post={item}
                onPress={(post: UgcPost) =>
                  navigation.navigate('UgcPost', { postId: post.id })
                }
              />
            </View>
          )}
          ListFooterComponent={<View style={styles.footerSpacer} />}
        />
      )}

      <Pressable
        style={styles.submitButton}
        onPress={() => setShowSubmit(true)}
        accessibilityLabel="Submit your Stratos moment"
      >
        <Text style={styles.submitButtonText}>Submit your Stratos moment</Text>
      </Pressable>

      <UgcHowItWorksModal visible={showHow} onClose={() => setShowHow(false)} />

      {showSubmit ? (
        <View style={styles.submitOverlay}>
          <View style={styles.submitSheet}>
            <Text style={styles.submitTitle}>Submit</Text>
            <Text style={styles.submitCopy}>
              For now: post on Instagram/TikTok with #StratosSmile. We curate highlights
              weekly.
            </Text>
            <Pressable style={styles.closeButton} onPress={() => setShowSubmit(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandBackground,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.brandBackground,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.select({ ios: 24, default: 12 }),
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
  title: {
    color: colors.brandText,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.brandText,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  howButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  howButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: colors.brandText,
  },
  grid: {
    paddingHorizontal: 14,
    paddingBottom: 110,
  },
  list: {
    flex: 1,
  },
  footerSpacer: {
    height: 20,
  },
  columnWrap: {
    justifyContent: 'space-between',
  },
  tileWrap: {
    flex: 1,
    paddingHorizontal: 4,
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 18,
    right: 18,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  submitButtonText: {
    textAlign: 'center',
    color: colors.brandBackground,
    fontWeight: '700',
    fontSize: 14,
  },
  submitOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 10, 36, 0.64)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  submitSheet: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#10245f',
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
  },
  submitTitle: {
    color: colors.brandText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  submitCopy: {
    color: colors.brandText,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  closeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  closeButtonText: {
    color: colors.brandText,
    fontWeight: '700',
    fontSize: 13,
  },
});

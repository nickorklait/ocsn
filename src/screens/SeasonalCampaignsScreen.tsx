import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const SeasonalCampaignsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Seasonal Campaigns</Text>
      <Text style={styles.body}>
        This space is ready for rotating promos, limited drops, and seasonal launches.
      </Text>
      <Text style={styles.body}>
        Add campaign tiles, hero imagery, and timing notes here when you are ready.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    backgroundColor: colors.brandBackground,
  },
  heading: {
    color: colors.brandText,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  body: {
    color: colors.brandText,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.95,
    marginBottom: 12,
  },
});

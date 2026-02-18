import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>About Stratos</Text>
      <Text style={styles.body}>
        Stratos is a lightweight mobile starter focused on clear brand presence and fast
        iteration for product teams.
      </Text>
      <Text style={styles.body}>
        This placeholder screen can be expanded with mission details, roadmap updates, and
        release notes.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
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

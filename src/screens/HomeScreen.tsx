import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from '../components/BrandLogo';
import { colors } from '../theme/colors';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <BrandLogo />
        <Text style={styles.caption}>Stratos</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.brandBackground,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caption: {
    marginTop: 8,
    color: colors.brandText,
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: '600',
  },
});

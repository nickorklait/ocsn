import React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

const LOGO_ASPECT_RATIO = 800 / 500;

export const BrandLogo = () => {
  const { width } = useWindowDimensions();
  // Keep the logo large but bounded for very wide phones.
  const logoWidth = Math.min(width * 0.75, 320);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/stratos/stratos-cow.png')}
        resizeMode="contain"
        style={{ width: logoWidth, aspectRatio: LOGO_ASPECT_RATIO }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
});

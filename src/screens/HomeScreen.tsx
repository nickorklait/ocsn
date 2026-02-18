import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BrandLogo } from '../components/BrandLogo';
import { colors } from '../theme/colors';

export const HomeScreen = () => {
  const idleOffset = useRef(new Animated.Value(0)).current;
  const tapOffset = useRef(new Animated.Value(0)).current;
  const mooOpacity = useRef(new Animated.Value(0)).current;
  const [showMoo, setShowMoo] = useState(false);

  useEffect(() => {
    const idleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(idleOffset, {
          toValue: -6,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(idleOffset, {
          toValue: 6,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    idleLoop.start();

    return () => {
      idleLoop.stop();
    };
  }, [idleOffset]);

  const triggerBounce = () => {
    tapOffset.stopAnimation();
    mooOpacity.stopAnimation();

    Animated.sequence([
      Animated.spring(tapOffset, {
        toValue: -20,
        speed: 18,
        bounciness: 9,
        useNativeDriver: true,
      }),
      Animated.spring(tapOffset, {
        toValue: 0,
        speed: 14,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();

    setShowMoo(true);
    mooOpacity.setValue(0);

    Animated.sequence([
      Animated.timing(mooOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.delay(760),
      Animated.timing(mooOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => setShowMoo(false));
  };

  const translateY = Animated.add(idleOffset, tapOffset);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Pressable accessibilityLabel="Stratos cow" onPress={triggerBounce}>
          <Animated.View style={{ transform: [{ translateY }] }}>
            <BrandLogo />
          </Animated.View>
        </Pressable>
        {showMoo ? (
          <Animated.Text style={[styles.mooLabel, { opacity: mooOpacity }]}>
            Moo!
          </Animated.Text>
        ) : null}
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
  mooLabel: {
    marginTop: 8,
    color: colors.brandText,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

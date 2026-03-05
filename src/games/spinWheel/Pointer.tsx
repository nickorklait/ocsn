import React from 'react';
import { StyleSheet, View } from 'react-native';

type PointerProps = {
  size: number;
};

export const Pointer = ({ size }: PointerProps) => {
  return (
    <View style={styles.wrap}>
      <View style={[styles.pin, { width: size * 0.5, height: size * 0.5, borderRadius: size * 0.25 }]} />
      <View
        style={[
          styles.pointer,
          {
            borderLeftWidth: size / 2,
            borderRightWidth: size / 2,
            borderBottomWidth: size,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pin: {
    backgroundColor: '#f9c74f',
    borderWidth: 2,
    borderColor: '#fff7cf',
    marginBottom: 2,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f9c74f',
    borderStyle: 'solid',
  },
});

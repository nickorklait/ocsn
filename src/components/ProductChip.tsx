import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

interface ProductChipProps {
  label: string;
  disabled?: boolean;
  onPress?: () => void;
}

export const ProductChip = ({ label, disabled, onPress }: ProductChipProps) => {
  return (
    <Pressable
      style={[
        styles.chip,
        disabled ? styles.chipDisabled : null,
        disabled ? null : styles.chipActive,
      ]}
      onPress={disabled ? undefined : onPress}
    >
      <Text style={[styles.chipText, disabled ? styles.chipTextDisabled : null]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.3)',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: 'rgba(233, 238, 255, 0.12)',
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextDisabled: {
    color: 'rgba(233, 238, 255, 0.7)',
  },
});

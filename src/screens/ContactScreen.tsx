import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const ContactScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contact</Text>
      <Text style={styles.body}>Questions, support requests, or partnership ideas:</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Pressable onPress={() => Linking.openURL('mailto:hello@stratos.example')}>
          <Text style={styles.link}>hello@stratos.example</Text>
        </Pressable>

        <Text style={styles.label}>Phone</Text>
        <Pressable onPress={() => Linking.openURL('tel:+15550100425')}>
          <Text style={styles.link}>+1 (555) 010-0425</Text>
        </Pressable>

        <Text style={styles.label}>Hours</Text>
        <Text style={styles.value}>Mon-Fri, 9:00 AM-5:00 PM PT</Text>
      </View>
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
    marginBottom: 14,
  },
  card: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
  },
  label: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginTop: 8,
    marginBottom: 4,
    opacity: 0.9,
  },
  link: {
    color: colors.brandText,
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  value: {
    color: colors.brandText,
    fontSize: 16,
    marginBottom: 4,
  },
});

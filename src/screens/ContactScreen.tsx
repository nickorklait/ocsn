import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const ContactScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Kontakt oss</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adresse til fabrikken</Text>
        <Text style={styles.body}>Orkla Snacks, Nidar</Text>
        <Text style={styles.body}>Postboks 2444 Torgard</Text>
        <Text style={styles.body}>7005 Trondheim</Text>

        <Text style={styles.label}>Besoksadresse</Text>
        <Text style={styles.body}>Bromstadveien 2, Trondheim</Text>

        <Text style={styles.label}>Tlf sentralbord</Text>
        <Pressable onPress={() => Linking.openURL('tel:73583000')}>
          <Text style={styles.link}>73583000</Text>
        </Pressable>

        <Text style={styles.label}>Omvisning i fabrikken</Text>
        <Text style={styles.body}>Ta kontakt via sentralbordet for tilgjengelige tider.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adresse til administrasjonen</Text>
        <Text style={styles.body}>Orkla Snacks Norge</Text>
        <Text style={styles.body}>Postboks 13 Skoyen</Text>
        <Text style={styles.body}>0212 Oslo</Text>

        <Text style={styles.label}>Besoksadresse</Text>
        <Text style={styles.body}>Drammensveien 149, 0277 Oslo</Text>
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
  section: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.brandText,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  body: {
    color: colors.brandText,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.95,
    marginBottom: 6,
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
    marginTop: 10,
    marginBottom: 6,
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

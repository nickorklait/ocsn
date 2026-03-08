import React, { useState } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { routes } from '../../navigation/routes';
import { colors } from '../../theme/colors';
import { ChocolatePreview } from './ChocolatePreview';
import { IngredientSelector } from './IngredientSelector';
import { useChocolateBuilder } from './useChocolateBuilder';

export const BuildChocolateScreen = () => {
  const navigation = useNavigation<any>();
  const {
    ingredients,
    selectedIngredients,
    customToppings,
    toggleIngredient,
    randomizeChocolate,
    addCustomTopping,
    removeCustomTopping,
    shareText,
  } = useChocolateBuilder();
  const [resultVisible, setResultVisible] = useState(false);
  const [communityModalVisible, setCommunityModalVisible] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const hasAnyTopping = selectedIngredients.length > 0 || customToppings.length > 0;

  const handleShare = async () => {
    await Share.share({ message: shareText });
  };

  const handleAddCustomTopping = () => {
    const added = addCustomTopping(customInput);
    if (added) {
      setCustomInput('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.topBarButton}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Text style={styles.topBarButtonText}>Menu</Text>
        </Pressable>
        <Pressable
          style={styles.topBarButton}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate(routes.Tabs))}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={styles.topBarButtonText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Build Your Own Chocolate</Text>
        <Text style={styles.subtitle}>Design your dream Stratos bar and add any wishlist topping.</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ChocolatePreview selectedIngredients={selectedIngredients} customToppings={customToppings} />

        <View style={styles.selectorWrap}>
          <IngredientSelector
            ingredients={ingredients}
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
          />
        </View>

        <View style={styles.customSection}>
          <Text style={styles.customSectionTitle}>Add your own topping</Text>
          <View style={styles.customInputRow}>
            <TextInput
              value={customInput}
              onChangeText={setCustomInput}
              placeholder="e.g. Chili flakes, Raspberry, Sea salt"
              placeholderTextColor="rgba(233, 238, 255, 0.55)"
              style={styles.customInput}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleAddCustomTopping}
            />
            <Pressable style={styles.addButton} onPress={handleAddCustomTopping} accessibilityRole="button">
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
          {customToppings.length > 0 ? (
            <View style={styles.customList}>
              {customToppings.map((label) => (
                <Pressable
                  key={label}
                  style={styles.customListChip}
                  onPress={() => removeCustomTopping(label)}
                  accessibilityLabel={`Remove ${label}`}
                >
                  <Text style={styles.customListChipText}>{label} ×</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.secondaryButton} onPress={randomizeChocolate} accessibilityRole="button">
            <Text style={styles.secondaryButtonText}>Random Chocolate</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, !hasAnyTopping ? styles.buttonDisabled : null]}
            onPress={() => setResultVisible(true)}
            disabled={!hasAnyTopping}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Share My Chocolate</Text>
          </Pressable>
          <Pressable
            style={styles.placeholderButton}
            onPress={() => setCommunityModalVisible(true)}
            accessibilityRole="button"
          >
            <Text style={styles.placeholderButtonText}>Submit Chocolate Idea</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={resultVisible} transparent animationType="slide" onRequestClose={() => setResultVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.resultSheet}>
            <Text style={styles.resultTitle}>Your Stratos Creation</Text>
            <ChocolatePreview selectedIngredients={selectedIngredients} customToppings={customToppings} />
            <Text style={styles.resultText}>{shareText}</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.secondaryButton} onPress={() => setResultVisible(false)}>
                <Text style={styles.secondaryButtonText}>Back to Builder</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={handleShare}>
                <Text style={styles.primaryButtonText}>Share My Chocolate</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={communityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCommunityModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCommunityModalVisible(false)}>
          <Pressable style={styles.communitySheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.communityTitle}>Community voting coming soon.</Text>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => setCommunityModalVisible(false)}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0b1e61',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  topBarButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  topBarButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  title: {
    color: colors.brandText,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: 'rgba(233, 238, 255, 0.84)',
    fontSize: 14,
  },
  selectorWrap: {
    paddingHorizontal: 14,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 22,
  },
  actions: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 12,
    gap: 10,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#4cc9f0',
  },
  primaryButtonText: {
    color: '#062562',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.28)',
    backgroundColor: 'rgba(233, 238, 255, 0.11)',
  },
  secondaryButtonText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '700',
  },
  placeholderButton: {
    borderRadius: 16,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  placeholderButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.48,
  },
  customSection: {
    marginTop: 10,
    marginHorizontal: 18,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.18)',
    backgroundColor: 'rgba(233, 238, 255, 0.07)',
  },
  customSectionTitle: {
    color: colors.brandText,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.24)',
    backgroundColor: 'rgba(2, 12, 44, 0.42)',
    color: colors.brandText,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginRight: 8,
  },
  addButton: {
    borderRadius: 12,
    backgroundColor: '#4cc9f0',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  addButtonText: {
    color: '#062562',
    fontSize: 13,
    fontWeight: '800',
  },
  customList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  customListChip: {
    marginRight: 6,
    marginTop: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  customListChipText: {
    color: colors.brandText,
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
    backgroundColor: 'rgba(3, 10, 36, 0.7)',
  },
  resultSheet: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.24)',
    backgroundColor: '#10245f',
  },
  resultTitle: {
    color: colors.brandText,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  resultText: {
    marginTop: 8,
    marginBottom: 10,
    color: colors.brandText,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  modalActions: {
    gap: 8,
  },
  communitySheet: {
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.24)',
    backgroundColor: '#10245f',
  },
  communityTitle: {
    color: colors.brandText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
});

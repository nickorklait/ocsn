import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { AboutScreen } from './src/screens/AboutScreen';
import { ContactScreen } from './src/screens/ContactScreen';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { ProductDetailsScreen } from './src/screens/ProductDetailsScreen';
import { Product } from './src/data/products/types';
import { colors } from './src/theme/colors';

type Screen = 'home' | 'about' | 'contact' | 'products' | 'productDetails';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    const webDocument = (globalThis as { document?: any }).document;

    if (!menuVisible || !webDocument) {
      return;
    }

    const onEscape = (event: { key?: string }) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    webDocument.addEventListener('keydown', onEscape);

    return () => {
      webDocument.removeEventListener('keydown', onEscape);
    };
  }, [menuVisible]);

  const selectScreen = (screen: Screen) => {
    if (screen !== 'productDetails') {
      setSelectedProduct(null);
    }
    setActiveScreen(screen);
    closeMenu();
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveScreen('productDetails');
  };

  const renderScreen = () => {
    if (activeScreen === 'about') {
      return <AboutScreen />;
    }

    if (activeScreen === 'contact') {
      return <ContactScreen />;
    }

    if (activeScreen === 'products') {
      return <ProductsScreen onSelectProduct={openProduct} />;
    }

    if (activeScreen === 'productDetails' && selectedProduct) {
      return (
        <ProductDetailsScreen
          product={selectedProduct}
          onBack={() => setActiveScreen('products')}
        />
      );
    }

    return <HomeScreen />;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Stratos</Text>
        <Pressable style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuButtonText}>Menu</Text>
        </Pressable>
      </View>

      <View style={styles.content}>{renderScreen()}</View>

      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={closeMenu}
      >
        <Pressable style={styles.overlay} onPress={closeMenu}>
          <Pressable style={styles.menuPanel} onPress={(event) => event.stopPropagation()}>
            <Pressable style={styles.menuItem} onPress={() => selectScreen('home')}>
              <Text style={styles.menuItemText}>Home</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => selectScreen('about')}>
              <Text style={styles.menuItemText}>About</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => selectScreen('contact')}>
              <Text style={styles.menuItemText}>Contact</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => selectScreen('products')}>
              <Text style={styles.menuItemText}>Products</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.brandBackground,
  },
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.brandBackground,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(233, 238, 255, 0.2)',
    zIndex: 20,
    elevation: 20,
  },
  title: {
    color: colors.brandText,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  menuButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  menuButtonText: {
    color: colors.brandText,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  content: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 10, 36, 0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 72,
    paddingHorizontal: 20,
  },
  menuPanel: {
    width: 220,
    borderRadius: 14,
    paddingVertical: 8,
    backgroundColor: '#122973',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    color: colors.brandText,
    fontSize: 16,
    fontWeight: '500',
  },
});

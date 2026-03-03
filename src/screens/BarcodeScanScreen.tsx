import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { loadProducts } from '../data/products/xmlProducts';
import { Product } from '../data/products/types';
import { routes } from '../navigation/routes';
import { colors } from '../theme/colors';

export const BarcodeScanScreen = ({ navigation }: { navigation: any }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const hasPermission = permission?.granted ?? null;

  useEffect(() => {
    if (!permission) {
      return;
    }
    if (!permission.granted) {
      requestPermission().catch(() => undefined);
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    let mounted = true;
    loadProducts()
      .then((items) => {
        if (mounted) {
          setProducts(items);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setProducts([]);
          setIsLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const productByGtin = useMemo(() => {
    const lookup = new Map<string, Product>();
    products.forEach((product) => {
      if (product.gtin) {
        lookup.set(product.gtin, product);
      }
      if (product.masterErpNumber) {
        lookup.set(product.masterErpNumber, product);
      }
    });
    return lookup;
  }, [products]);

  const handleScan = useCallback(
    ({ data }: { data: string }) => {
      if (scanResult) {
        return;
      }
      setScanResult(data);
      const match = productByGtin.get(data);
      if (match) {
        navigation.navigate(routes.Products, {
          screen: 'ProductDetails',
          params: { product: match },
        });
      }
    },
    [productByGtin, scanResult, navigation]
  );

  if (hasPermission === null || isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brandText} />
        <Text style={styles.body}>Preparing scanner...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Camera permission needed</Text>
        <Text style={styles.body}>
          Enable camera access to scan a Stratos barcode.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Stratos barcode</Text>
      <Text style={styles.body}>
        Point your camera at the barcode on the package. We’ll open the product.
      </Text>
      <View style={styles.scannerWrap}>
        <CameraView
          onBarcodeScanned={scanResult ? undefined : handleScan}
          style={styles.scanner}
        />
      </View>
      {scanResult ? (
        <View style={styles.resultCard}>
          <Text style={styles.body}>Scanned: {scanResult}</Text>
          <Pressable style={styles.resetButton} onPress={() => setScanResult(null)}>
            <Text style={styles.resetButtonText}>Scan again</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandBackground,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.brandBackground,
    paddingHorizontal: 20,
  },
  title: {
    color: colors.brandText,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  body: {
    color: colors.brandText,
    opacity: 0.85,
    marginBottom: 12,
  },
  scannerWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(233, 238, 255, 0.06)',
    height: 280,
  },
  scanner: {
    flex: 1,
  },
  resultCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 238, 255, 0.2)',
    backgroundColor: 'rgba(233, 238, 255, 0.08)',
  },
  resetButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  resetButtonText: {
    color: colors.brandText,
    fontSize: 13,
    fontWeight: '700',
  },
});

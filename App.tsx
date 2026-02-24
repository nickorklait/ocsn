import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { initGlobalErrorHandlers } from './src/utils/errorReporting';

export default function App() {
  useEffect(() => {
    initGlobalErrorHandlers();
  }, []);

  const navigationTheme: Theme = {
    dark: true,
    colors: {
      primary: colors.brandText,
      background: colors.brandBackground,
      card: colors.brandBackground,
      text: colors.brandText,
      border: 'rgba(233, 238, 255, 0.2)',
      notification: colors.brandText,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '800' },
    },
  };

  return (
    <ErrorBoundary>
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
}

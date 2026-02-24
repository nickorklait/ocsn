import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { reportError } from '../utils/errorReporting';
import { colors } from '../theme/colors';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    reportError(error, 'ErrorBoundary');
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.subtitle}>Please try again.</Text>
          <Pressable style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
          {__DEV__ && this.state.error ? (
            <Text style={styles.devText}>{this.state.error.message}</Text>
          ) : null}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: colors.brandText,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.brandText,
    opacity: 0.8,
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(233, 238, 255, 0.14)',
  },
  buttonText: {
    color: colors.brandText,
    fontWeight: '700',
  },
  devText: {
    marginTop: 12,
    color: colors.brandText,
    fontSize: 12,
    opacity: 0.7,
  },
});

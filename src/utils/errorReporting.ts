import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_ERROR_KEY = 'stratos:lastError';

type ErrorContext = {
  message: string;
  stack?: string;
  source?: string;
  timestamp: string;
};

export const reportError = async (error: unknown, source?: string) => {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const payload: ErrorContext = {
    message,
    stack,
    source,
    timestamp: new Date().toISOString(),
  };

  // Log for dev and for device logs in production.
  // eslint-disable-next-line no-console
  console.error('Stratos error', payload);

  try {
    await AsyncStorage.setItem(LAST_ERROR_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage errors
  }
};

export const getLastError = async () => {
  try {
    const value = await AsyncStorage.getItem(LAST_ERROR_KEY);
    return value ? (JSON.parse(value) as ErrorContext) : null;
  } catch {
    return null;
  }
};

export const clearLastError = async () => {
  try {
    await AsyncStorage.removeItem(LAST_ERROR_KEY);
  } catch {
    // ignore storage errors
  }
};

export const initGlobalErrorHandlers = () => {
  const globalAny = globalThis as { ErrorUtils?: any; window?: any };

  if (globalAny.ErrorUtils?.setGlobalHandler) {
    const previousHandler = globalAny.ErrorUtils.getGlobalHandler?.();
    globalAny.ErrorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
      reportError(error, isFatal ? 'global:fatal' : 'global');
      if (previousHandler) {
        previousHandler(error, isFatal);
      }
    });
  }

  if (globalAny.window?.addEventListener) {
    globalAny.window.addEventListener('error', (event: ErrorEvent) => {
      reportError(event.error || event.message, 'window.onerror');
    });
  }
};

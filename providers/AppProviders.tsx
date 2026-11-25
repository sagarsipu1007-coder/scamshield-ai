import { useState, useEffect, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { ThemeProvider } from '@/theme/ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

/**
 * Reads the persisted Redux preference for theme mode so the native
 * color scheme hooks resolve correctly on first paint. Kept as a no-op
 * stub here; preferences live in Redux in-memory for this demo.
 */
export function useBootstrapReady() {
  useEffect(() => {}, []);
}

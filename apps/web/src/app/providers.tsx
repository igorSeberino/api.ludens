'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from '@account/contexts/AuthContext';
import { wakeApiFromBrowser } from '@web/lib/wake-api';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    wakeApiFromBrowser(process.env.NEXT_PUBLIC_API_WAKE_URL);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>

      <Toaster
        richColors
        position="bottom-right"
      />
    </QueryClientProvider>
  );
}

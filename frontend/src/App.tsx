import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Chat from './components/Chat';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

interface AppProps {
  children: React.ReactNode;
}

export default function App({children}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className='min-h-screen'>{children}</div>
        <Chat />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

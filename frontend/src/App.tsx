import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Chat from './components/Chat';

const queryClient = new QueryClient();

interface AppProps {
  children: React.ReactNode;
}

export default function App({children}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='min-h-screen'>{children}</div>
      <Chat />
    </QueryClientProvider>
  );
}

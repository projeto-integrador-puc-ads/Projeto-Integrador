import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider } from './theme/AppThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';
import { setAuthToken } from '@/lib/http';

const queryClient = new QueryClient();

const storedToken = localStorage.getItem('token');
if (storedToken) {
  setAuthToken(storedToken);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppThemeProvider>
          <AppRoutes />
        </AppThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

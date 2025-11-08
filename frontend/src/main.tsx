import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider } from './theme/AppThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes';
import { SnackbarProvider } from 'notistack';
import { setDevUserId } from './lib/http';

const queryClient = new QueryClient();

// � SELETOR DE PERFIL (DESENVOLVIMENTO)
// ID 2 = Dona Maria (Cliente/Idoso)
// ID 3 = João Cuidador (Cuidador Profissional)

// Verifica se já existe perfil salvo no localStorage
const savedUserId = localStorage.getItem('devUserId');
if (savedUserId) {
  setDevUserId(parseInt(savedUserId));
} else {
  // Padrão: Cliente (Dona Maria)
  setDevUserId(2);
  localStorage.setItem('devUserId', '2');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppThemeProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={2500} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <AppRoutes />
          </SnackbarProvider>
        </AppThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

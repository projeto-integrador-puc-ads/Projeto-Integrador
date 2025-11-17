import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppThemeProvider } from './theme/AppThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { AppRoutes } from './routes';

import { MainLayout } from './features/sabordafamilia/components/MainLayout';
import { FeedPage } from './features/sabordafamilia/pages/FeedPage';
import { CreateRecipePage } from './features/sabordafamilia/pages/CreateRecipePage';
import { ProfilePage } from './features/sabordafamilia/pages/ProfilePage';
import { FavoritesPage } from './features/sabordafamilia/pages/FavoritesPage';
import { ChatListPage } from './features/sabordafamilia/pages/ChatListPage';
import { RecipeDetailPage } from './features/sabordafamilia/pages/RecipeDetailPage';
import { UserRecipesPage } from './features/sabordafamilia/pages/UserRecipesPage';
// Corrigido de 'ChatDetailpage' (p minúsculo) para 'ChatDetailPage' (P maiúsculo)
import { ChatDetailPage } from './features/sabordafamilia/pages/ChatDetailpage';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppThemeProvider>
          {/* <AppRoutes /> */}

          <Routes>
            {/* Rotas do módulo "sabordafamilia" com o layout principal */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<FeedPage />} />
              <Route path="/nova-receita" element={<CreateRecipePage />} />
              <Route path="/perfil/:id" element={<ProfilePage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/minhas-receitas" element={<UserRecipesPage />} />
              <Route path="/receita/:id" element={<RecipeDetailPage />} />
              
              {/* Rotas de Chat */}
              <Route path="/chat" element={<ChatListPage />} />
              <Route path="/chat/:contactId" element={<ChatDetailPage />} />
            </Route>
            
            {/* Rotas sem o layout principal (ex: login, etc) */}

          </Routes>
          
        </AppThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
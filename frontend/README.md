# Frontend - CareHub Web

Interface web desenvolvida com **React 18** e **TypeScript** para o sistema CareHub.

---

## 🎨 Tecnologias

- ⚛️ **React 18.3.1**
- 📘 **TypeScript 5.6.2**
- ⚡ **Vite 6.0.11** (build tool)
- 🎨 **Material-UI 6.3.0** (componentes)
- 🔄 **TanStack Query 5.64.5** (data fetching)
- 🛣️ **React Router 7.1.3** (roteamento)
- 🎭 **Emotion** (CSS-in-JS)

---

## 🚀 Como Executar

### Pré-requisitos

1. **Node.js 18+** (recomendado: 20+)
2. **npm** ou **yarn**
3. **Backend** rodando em `http://localhost:8080`

### Instalar Dependências

```bash
npm install
# ou
yarn install
```

### Executar em Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

**Aplicação:** http://localhost:5173

### Build para Produção

```bash
npm run build
# ou
yarn build
```

**Arquivos gerados em:** `dist/`

### Preview da Build

```bash
npm run preview
# ou
yarn preview
```

---

## 📂 Estrutura do Projeto

```
frontend/src/
├── features/                   # Features por módulo
│   ├── carehub/                # Módulo CareHub
│   │   ├── components/         # Componentes CareHub
│   │   │   ├── CareHubModuleGrid.tsx
│   │   │   ├── ProximosAtendimentos.tsx
│   │   │   └── EstatisticasAtendimento.tsx
│   │   ├── pages/              # Páginas CareHub
│   │   │   ├── CareHubHomePage.tsx
│   │   │   ├── ProntuariosPage.tsx
│   │   │   ├── MensagensPage.tsx
│   │   │   └── AvaliacoesPage.tsx
│   │   └── api/                # Chamadas de API
│   │       ├── prontuarios.ts
│   │       ├── mensagens.ts
│   │       └── avaliacoes.ts
│   │
│   └── grupo1/                 # Módulo Usuários
│       ├── api/
│       │   └── usuarios.ts
│       └── pages/
│           └── UsuariosPage.tsx
│
├── layouts/                    # Layouts reutilizáveis
│   └── AppLayout.tsx
│
├── routes/                     # Configuração de rotas
│   └── index.tsx
│
├── lib/                        # Utilitários
│   └── http.ts                 # Cliente HTTP (axios)
│
├── theme/                      # Tema Material-UI
│   ├── AppThemeProvider.tsx
│   └── index.ts
│
├── shared/                     # Código compartilhado
│   └── types/
│       └── usuario.ts
│
├── components/                 # Componentes globais
│   ├── ModuleCard.tsx
│   └── ModuleGrid.tsx
│
├── App.tsx                     # Componente raiz
├── main.tsx                    # Entry point
└── index.css                   # Estilos globais
```

---

## 🛣️ Rotas da Aplicação

### Rotas Principais

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `HomePage` | Página inicial (módulos) |
| `/carehub` | `CareHubHomePage` | Home do CareHub |
| `/carehub/prontuarios` | `ProntuariosPage` | Gerenciar prontuários |
| `/carehub/mensagens` | `MensagensPage` | Sistema de mensagens |
| `/carehub/avaliacoes` | `AvaliacoesPage` | Avaliações de cuidadores |
| `/usuarios` | `UsuariosPage` | CRUD de usuários |

**Total:** 6 rotas

### Configuração (routes/index.tsx)

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "carehub", element: <CareHubHomePage /> },
      { path: "carehub/prontuarios", element: <ProntuariosPage /> },
      { path: "carehub/mensagens", element: <MensagensPage /> },
      { path: "carehub/avaliacoes", element: <AvaliacoesPage /> },
      { path: "usuarios", element: <UsuariosPage /> },
    ],
  },
]);
```

---

## 🔌 Integração com API

### Cliente HTTP (lib/http.ts)

```typescript
import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    "X-User-Id": "3", // Simula autenticação
  },
});
```

### Exemplo de API Call (features/carehub/api/prontuarios.ts)

```typescript
import { http } from "@/lib/http";
import type { Prontuario } from "./types";

export const prontuariosApi = {
  listarTodos: () => http.get<Prontuario[]>("/prontuarios"),
  
  buscarPorId: (id: number) => 
    http.get<Prontuario>(`/prontuarios/${id}`),
  
  criar: (data: Partial<Prontuario>) => 
    http.post<Prontuario>("/prontuarios", data),
  
  atualizar: (id: number, data: Partial<Prontuario>) => 
    http.put<Prontuario>(`/prontuarios/${id}`, data),
};
```

---

## 🎨 Componentes Principais

### CareHubModuleGrid

Grid de cards com os 3 módulos principais do CareHub.

**Localização:** `features/carehub/components/CareHubModuleGrid.tsx`

```tsx
<CareHubModuleGrid />
```

**Cards:**
- 📋 **Prontuários** → `/carehub/prontuarios`
- 💬 **Mensagens** → `/carehub/mensagens`
- ⭐ **Avaliações** → `/carehub/avaliacoes`

### ProximosAtendimentos

Exibe próximos agendamentos do usuário.

**Localização:** `features/carehub/components/ProximosAtendimentos.tsx`

```tsx
<ProximosAtendimentos />
```

**Funcionalidades:**
- Lista agendamentos futuros
- Mostra horário e status
- Indicador visual por status (chip colorido)
- Link direto para prontuário

### EstatisticasAtendimento

Dashboard com estatísticas do CareHub.

**Localização:** `features/carehub/components/EstatisticasAtendimento.tsx`

```tsx
<EstatisticasAtendimento />
```

**Métricas:**
- Total de atendimentos
- Próximos agendamentos
- Mensagens não lidas
- Média de avaliações

---

## 🔄 Gerenciamento de Estado

### TanStack Query (React Query)

Usado para **cache** e **sincronização** de dados do servidor.

**Exemplo (ProntuariosPage):**

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prontuariosApi } from "../api/prontuarios";

function ProntuariosPage() {
  const queryClient = useQueryClient();
  
  // Buscar dados
  const { data: prontuarios, isLoading } = useQuery({
    queryKey: ["prontuarios"],
    queryFn: () => prontuariosApi.listarTodos(),
  });
  
  // Criar prontuário
  const mutation = useMutation({
    mutationFn: prontuariosApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prontuarios"] });
    },
  });
  
  return (/* JSX */);
}
```

**Benefícios:**
- ✅ Cache automático
- ✅ Refetch em background
- ✅ Loading/error states
- ✅ Invalidação inteligente

---

## 🎨 Tema e Estilos

### Material-UI Theme (theme/index.ts)

```typescript
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});
```

### Aplicar Tema (theme/AppThemeProvider.tsx)

```tsx
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./index";

export function AppThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

---

## 📦 Principais Dependências

### Produção

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router": "^7.1.3",
  "@mui/material": "^6.3.0",
  "@tanstack/react-query": "^5.64.5",
  "axios": "^1.7.9",
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.0"
}
```

### Desenvolvimento

```json
{
  "typescript": "~5.6.2",
  "vite": "^6.0.11",
  "@vitejs/plugin-react": "^4.3.4",
  "eslint": "^9.17.0"
}
```

---

## 🧪 Scripts Disponíveis

```json
{
  "dev": "vite",                    // Servidor de desenvolvimento
  "build": "tsc -b && vite build",  // Build de produção
  "preview": "vite preview",        // Preview da build
  "lint": "eslint ."                // Verificar código
}
```

---

## ⚙️ Configurações Importantes

### vite.config.ts

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080", // Proxy para backend
    },
  },
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🔒 Segurança

### Autenticação (Desenvolvimento)

Atualmente usa header simulado no cliente HTTP:

```typescript
headers: {
  "X-User-Id": "3", // ID do usuário logado
}
```

**⚠️ Nota:** Em produção, substituir por JWT ou OAuth2.

### CORS

Configurado no backend para aceitar `localhost:5173` e `localhost:5174`.

---

## 🐛 Debug e Logs

### React Query Devtools

Adicionar para desenvolvimento:

```bash
npm install @tanstack/react-query-devtools
```

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## 📊 Estrutura de Features

Cada feature segue o padrão:

```
features/{nome}/
├── api/              # Chamadas de API
│   └── {nome}.ts
├── components/       # Componentes específicos
│   └── {Componente}.tsx
├── pages/            # Páginas
│   └── {Nome}Page.tsx
└── types/            # TypeScript types (opcional)
    └── {nome}.ts
```

**Exemplo:**

```
features/carehub/
├── api/
│   ├── prontuarios.ts
│   ├── mensagens.ts
│   └── avaliacoes.ts
├── components/
│   ├── CareHubModuleGrid.tsx
│   ├── ProximosAtendimentos.tsx
│   └── EstatisticasAtendimento.tsx
└── pages/
    ├── CareHubHomePage.tsx
    ├── ProntuariosPage.tsx
    ├── MensagensPage.tsx
    └── AvaliacoesPage.tsx
```

---

## 🎓 Desenvolvido por

**Romulo Castro** - PUC Goiás (ADS)  
**Data:** Janeiro 2025  
**Status:** ✅ 100% Concluído

---

**🚀 CareHub Web - Interface Moderna e Responsiva!**

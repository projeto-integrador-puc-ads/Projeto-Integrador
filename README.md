# Plataforma de Auxílio ao Idoso

**PUC GO (ADS)** - Uma plataforma digital desenvolvida para auxiliar idosos em seu dia a dia, promovendo autonomia, bem-estar e inclusão.

---

## ⚠️ **AVISO IMPORTANTE - SEGURANÇA**

### 🔓 **Modo Desenvolvimento Ativo**

As rotas da API estão **temporariamente LIBERADAS** (sem proteção JWT) para facilitar o desenvolvimento:
- ✅ Todos os grupos podem criar e testar suas APIs sem configurar autenticação
- ✅ Frontend pode fazer requests diretos
- ⚠️ **NÃO USAR EM PRODUÇÃO ASSIM!**

📖 **Antes de produção, consulte:** `ANTES_DE_PRODUCAO.md`

---

## 🏗️ Arquitetura do Projeto

### Tecnologias
- **Backend:** Java 21 + Spring Boot
- **Frontend:** React
- **Arquitetura:** Monólito organizado por módulos

### Estrutura Organizacional

O projeto foi estruturado para permitir desenvolvimento colaborativo entre **6 grupos** da turma, onde cada grupo trabalha de forma independente em funcionalidades específicas:

```
📁 projeto-integrador
├── 📁 backend/
│   └── 📁 br.pucgo.ads.projetointegrador
│       ├── 📁 grupo1/ (controller, service, repository, entity, dto)
│       ├── 📁 grupo2/ (controller, service, repository, entity, dto)
│       ├── 📁 grupo3/ (controller, service, repository, entity, dto)
│       ├── 📁 grupo4/ (controller, service, repository, entity, dto)
│       ├── 📁 grupo5/ (controller, service, repository, entity, dto)
│       ├── 📁 grupo6/ (controller, service, repository, entity, dto)
│       └── 📁 comum/    (entidades e DTOs compartilhados)
└── 📁 frontend/
    └── 📁 src/ (components, pages, services)
```

### 🎯 Como Funciona

- **Cada grupo** possui sua própria estrutura completa de camadas (Controller, Service, Repository, Entity, DTO)
- **Isolamento:** Um grupo não interfere no código de outro grupo
- **Compartilhamento:** Entidades comuns (ex: Usuario) ficam na pasta `comum`
- **APIs independentes:** Cada grupo cria seus próprios endpoints REST
- **Frontend unificado:** Interface única que consome todas as APIs dos projetos.

### 🔐 Autenticação (Grupo Plataforma)

O **Grupo Plataforma** é responsável pela autenticação centralizada. Todos os outros grupos devem:

1. **Usar os endpoints de autenticação:**
   - `POST /api/auth/signup` - Cadastro de usuário
   - `POST /api/auth/login` - Login (retorna JWT token)

2. **Enviar o token JWT** em todas as requisições:
   ```
   Authorization: Bearer {seu-token-jwt}
   ```

2. **Enviar o token JWT** em todas as requisições:
   ```
   Authorization: Bearer {seu-token-jwt}
   ```

3. **Consultar dados de usuários:**
   - `GET /api/users/{id}` - Dados do usuário
   - `GET /api/users/email/{email}` - Buscar por email

#### Tipos de Usuário (RoleType):
- `ROLE_USER` - Usuário padrão (atribuído automaticamente)
- `IDOSO` - ✅ Pode ser escolhido no cadastro
- `CUIDADOR` - ✅ Pode ser escolhido no cadastro
- `FAMILIAR` - ✅ Pode ser escolhido no cadastro
- `PROFISSIONAL_SAUDE` - 🔒 Apenas admin pode atribuir
- `ROLE_ADMIN` - 🔒 Apenas admin pode atribuir

> 📖 **Documentação completa:** Veja `SISTEMA_ROLES.md` para detalhes sobre segurança e validações.

#### ⚠️ Rotas Temporariamente Liberadas (Desenvolvimento):

Durante o desenvolvimento, as rotas estão **SEM proteção JWT** para facilitar a criação de telas.  
**Antes de produção:** Descomentar as anotações `@PreAuthorize` em `UserController.java`
# 🧪 Guia de Testes JWT - Postman

## 📦 Arquivos Gerados

1. **`Postman_Collection_JWT_Auth.json`** - Collection com 10 requests
2. **`Postman_Environment_JWT.json`** - Environment com variáveis

---

## 🚀 Como Importar no Postman

### Passo 1: Importar a Collection
1. Abra o Postman
2. Clique em **"Import"** (canto superior esquerdo)
3. Arraste o arquivo **`Postman_Collection_JWT_Auth.json`**
4. Clique em **"Import"**

### Passo 2: Importar o Environment
1. Clique no ícone de **⚙️ Settings** (canto superior direito)
2. Selecione **"Environments"**
3. Clique em **"Import"**
4. Arraste o arquivo **`Postman_Environment_JWT.json`**
5. Selecione o environment **"Projeto Integrador - JWT Environment"** no dropdown

---

## 🧪 Roteiro de Testes (ORDEM RECOMENDADA)

### ✅ **1. Signup - Registrar Usuario IDOSO**
📍 `POST /api/auth/signup` (PÚBLICO)

**Body:**
```json
{
    "name": "João Silva Santos",
    "username": "joao.silva",
    "email": "joao.silva@email.com",
    "password": "senha123456"
}
```

**Resultado Esperado:**
- ✅ Status: `201 Created`
- ✅ Response: `"User registered successfully!"`

---

### ✅ **2. Login - Obter Token JWT**
📍 `POST /api/auth/login` (PÚBLICO)

**Body:**
```json
{
    "usernameOrEmail": "joao.silva@email.com",
    "password": "senha123456"
}
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Response:
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer"
}
```

**🔑 IMPORTANTE:** O token JWT será **automaticamente salvo** na variável de ambiente `{{jwt_token}}`!

---

### ✅ **3. Buscar Usuario por ID (COM JWT)**
📍 `GET /api/users/1` (PROTEGIDO)

**Header:**
```
Authorization: Bearer {{jwt_token}}
```

**Resultado Esperado:**
- ✅ Status: `200 OK`
- ✅ Response: Dados do usuário

---

### ❌ **4. Teste SEM TOKEN (deve falhar)**
📍 `GET /api/users/1` (SEM AUTENTICAÇÃO)

**Resultado Esperado:**
- ❌ Status: `401 Unauthorized`
- ❌ Mensagem de erro

---

### ❌ **5. Teste TOKEN INVALIDO (deve falhar)**
📍 `GET /api/users/1` (COM TOKEN INVÁLIDO)

**Header:**
```
Authorization: Bearer token-invalido-123456
```

**Resultado Esperado:**
- ❌ Status: `401 Unauthorized`
- ❌ Mensagem: "Invalid JWT token"

---

## 📊 Validações de Sucesso

### ✅ **JWT funcionando corretamente se:**

1. **Signup** cria usuário no banco ✅
2. **Login** retorna token JWT válido ✅
3. **Endpoints protegidos** aceitam token válido ✅
4. **Endpoints protegidos** rejeitam requisições sem token (401) ✅
5. **Endpoints protegidos** rejeitam tokens inválidos (401) ✅

---

## 🔐 Estrutura dos RoleTypes

Atualmente configurado:
- `ROLE_USER` - Usuário padrão
- `ROLE_ADMIN` - Administrador

**Mapeamento para o projeto:**
- ✅ Todos os usuários registrados recebem `ROLE_USER` por padrão
- ✅ Endpoints `/api/users/*` requerem autenticação
- ✅ Endpoint `/api/users` (listar todos) requer `ROLE_ADMIN`

---

## 🛠️ Troubleshooting

### Erro: "Cannot find symbol User"
➡️ Verifique se a aplicação está rodando: `mvn spring-boot:run`

### Erro: "401 Unauthorized" com token válido
➡️ Verifique se o token está no formato: `Bearer {token}`

### Erro: "Connection refused"
➡️ Confirme que a aplicação está rodando na porta 8080

### Token não é salvo automaticamente
➡️ Vá em **Tests** da request de Login e verifique o script JavaScript

---

## 📝 Próximos Passos

Após validar que o JWT funciona:

1. ✅ Adicionar mais RoleTypes (`IDOSO`, `CUIDADOR`, etc.)
2. ✅ Implementar endpoints específicos por role
3. ✅ Adicionar refresh token
4. ✅ Implementar logout
5. ✅ Adicionar validação de email

---

## 🎯 Comandos Úteis

```bash
# Iniciar aplicação
mvn spring-boot:run

# Verificar se está rodando
curl http://localhost:8080/api/auth/login

# Ver logs do banco
psql -U postgres -d projeto_integrador -c "SELECT * FROM users;"

# Ver tabela de roles (se existir)
psql -U postgres -d projeto_integrador -c "SELECT * FROM user_roles;"
```

---

## ✅ Checklist de Validação

- [ ] Collection importada no Postman
- [ ] Environment selecionado
- [ ] Aplicação rodando na porta 8080
- [ ] Banco PostgreSQL conectado
- [ ] Signup funciona (201 Created)
- [ ] Login retorna JWT token (200 OK)
- [ ] Token salvo automaticamente em `{{jwt_token}}`
- [ ] Endpoint protegido funciona COM token (200 OK)
- [ ] Endpoint protegido falha SEM token (401 Unauthorized)
- [ ] Endpoint protegido falha com token INVÁLIDO (401 Unauthorized)

---

**🎉 Se todos os itens acima funcionarem, seu JWT está 100% operacional!**

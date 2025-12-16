# 📮 Guia de Uso - Postman Collections

## 📦 Arquivos Atualizados

### Collections
- **`Postman_Collection_Complete_API.json`** ⭐ **NOVA - USE ESTA!**
  - Collection completa com todos os endpoints
  - Inclui Auth, Users, Roles e Permissions
  - Atualizada com DTOs e correções de segurança

### Environments
- **`Postman_Environment_Complete.json`** ⭐ **NOVO - USE ESTE!**
  - Environment com todas as variáveis necessárias

### Collections Antigas (Mantidas para referência)
- `Postman_Collection_JWT_Auth.json` - Apenas Auth e Users
- `Postman_Collection_Permissions_CRUD.json` - Apenas Permissions

---

## 🚀 Como Importar no Postman

### 1. Importar Collection
1. Abra o Postman
2. Clique em **Import**
3. Selecione `Postman_Collection_Complete_API.json`
4. Clique em **Import**

### 2. Importar Environment
1. Clique no ícone de **Environments** (⚙️)
2. Clique em **Import**
3. Selecione `Postman_Environment_Complete.json`
4. Selecione o environment **"Projeto Integrador - Complete Environment"** no dropdown

---

## 🔑 Fluxo de Teste Recomendado

### Passo 1: Login como ADMIN
```
1. Vá para: 🔐 Authentication → Login - Obter Token JWT
2. Use as credenciais:
   {
     "usernameOrEmail": "admin",
     "password": "123456"
   }
3. O token JWT será salvo automaticamente na variável {{jwt_token}}
```

### Passo 2: Testar Endpoints de Users
```
✅ Get User by ID - Deve funcionar
✅ Get All Users - Deve funcionar (ADMIN)
✅ Update User - Deve funcionar (próprio usuário ou ADMIN)
✅ Delete User - Deve funcionar (ADMIN)
```

### Passo 3: Testar Endpoints de Roles
```
✅ Get All Roles - Retorna RoleResponseDto com permissions
✅ Get Role by ID - Retorna role específica
✅ Create Role - Criar nova role
✅ Update Role - Atualizar role existente
✅ Delete Role - Deletar role
```

### Passo 4: Testar Endpoints de Permissions
```
✅ Get All Permissions - Retorna lista de PermissionResponseDto
✅ Get Permission by ID
✅ Get Permission by Name
✅ Create Permission
✅ Update Permission
✅ Delete Permission
```

---

## 🔒 Mudanças de Segurança Importantes

### ⚠️ Endpoints que Mudaram

| Endpoint | Antes | Agora | Motivo |
|----------|-------|-------|--------|
| `PUT /api/users/{id}` | `isAuthenticated()` | `hasRole('ADMIN') or #id == authentication.principal.id` | **Segurança crítica** - Usuário só pode editar a si mesmo |
| `GET /api/permissions/*` | `isAuthenticated()` | `hasRole('ADMIN')` | Evitar exposição da estrutura de segurança |

### ✅ Endpoints que Continuam Iguais
- `GET /api/users/{id}` - Qualquer autenticado
- `GET /api/users` - ADMIN apenas
- `DELETE /api/users/{id}` - ADMIN apenas
- Todos os endpoints de Roles - ADMIN apenas

---

## 📊 Estrutura de Respostas (DTOs)

### UserResponseDto
```json
{
  "id": 1,
  "name": "Admin User",
  "username": "admin",
  "email": "admin@email.com",
  "role": {
    "id": 1,
    "code": "ADMIN",
    "name": "Administrador",
    "scope": "GLOBAL"
  },
  "crm": null,
  "certificacao": null,
  "experiencia": null,
  "phone": null,
  "birthDate": null,
  "photoUrl": null,
  "status": "ACTIVE",
  "createdAt": "2025-11-27T20:00:00-03:00",
  "updatedAt": "2025-11-27T20:00:00-03:00"
}
```

### RoleResponseDto
```json
{
  "id": 1,
  "code": "ADMIN",
  "name": "Administrador",
  "scope": "GLOBAL",
  "permissions": [
    {
      "id": 1,
      "name": "CREATE_USER",
      "moduleId": 1,
      "moduleName": "Users",
      "createdAt": "2025-11-27T20:00:00-03:00"
    }
  ],
  "createdAt": "2025-11-27T20:00:00-03:00"
}
```

### PermissionResponseDto
```json
{
  "id": 1,
  "name": "CREATE_USER",
  "moduleId": 1,
  "moduleName": "Users",
  "createdAt": "2025-11-27T20:00:00-03:00"
}
```

---

## 🎯 Ícones na Collection

- 🔓 = Público (sem autenticação)
- 🔒 = Requer autenticação
- 🔐 = Requer ROLE_ADMIN
- ⚠️ = Mudança de segurança importante

---

## ✅ Checklist de Testes

- [ ] Login funciona e salva token
- [ ] Endpoints de Users retornam DTOs corretos
- [ ] Endpoints de Roles retornam permissions
- [ ] Permissions só acessíveis por ADMIN
- [ ] Update User só funciona para próprio usuário ou ADMIN
- [ ] Todas as respostas estão em formato DTO (sem lazy loading)

---

**Data de Atualização:** 27/11/2025  
**Versão da API:** 1.0.0 (com DTOs e correções de segurança)

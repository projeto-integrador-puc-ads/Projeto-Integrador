# 🔐 Sistema de Roles - Documentação

## 📋 RoleTypes Disponíveis

O sistema possui **6 tipos de usuários**:

```java
public enum RoleType {
    ROLE_USER,              // Usuário padrão
    ROLE_ADMIN,             // Administrador
    IDOSO,                  // Idoso (usuário principal)
    CUIDADOR,               // Cuidador profissional
    FAMILIAR,               // Familiar do idoso
    PROFISSIONAL_SAUDE      // Médicos, enfermeiros, etc.
}
```

---

## 🛡️ Segurança: Whitelist de Cadastro

### **Roles Permitidas no Cadastro Público:**
✅ `IDOSO`  
✅ `CUIDADOR`  
✅ `FAMILIAR`  
✅ `ROLE_USER` (padrão se não informar)

### **Roles Bloqueadas (apenas Admin pode atribuir):**
❌ `ROLE_ADMIN`  
❌ `PROFISSIONAL_SAUDE`

---

## 🔒 Como Funciona a Validação

### **1. Cadastro COM role específica:**

```json
POST /api/auth/signup
{
  "name": "João Silva",
  "username": "joao",
  "email": "joao@email.com",
  "password": "senha123",
  "roleType": "IDOSO"
}
```

**Resposta:** ✅ 201 Created (se role for permitida)  
**Resposta:** ❌ 403 Forbidden (se tentar ADMIN ou PROFISSIONAL_SAUDE)

---

### **2. Cadastro SEM role:**

```json
POST /api/auth/signup
{
  "name": "Maria Costa",
  "username": "maria",
  "email": "maria@email.com",
  "password": "senha123"
}
```

**Resposta:** ✅ 201 Created  
**Role atribuída:** `ROLE_USER` (padrão)

---

### **3. Tentativa de Ataque (bloqueada):**

```json
POST /api/auth/signup
{
  "name": "Hacker",
  "username": "hacker",
  "email": "hacker@evil.com",
  "password": "123456",
  "roleType": "ROLE_ADMIN"  ← 🚨 BLOQUEADO!
}
```

**Resposta:** ❌ 403 Forbidden  
**Mensagem:** `"You cannot register with this user type. Allowed types: IDOSO, CUIDADOR, FAMILIAR"`

---

## 🧪 Testes no Postman

### **Collection Atualizada:**

A collection `Postman_Collection_JWT_Auth.json` foi atualizada com:

#### **Testes de Cadastro:**
1. ✅ Signup IDOSO
2. ✅ Signup CUIDADOR
3. ✅ Signup FAMILIAR
4. ✅ Signup sem role (usa ROLE_USER)
5. ❌ Signup bloqueado (tentativa de ADMIN)

#### **Como Testar:**

1. Importe a collection no Postman
2. Execute os requests na ordem
3. Verifique os logs no Console do Postman

**Exemplo de log esperado:**
```
✅ Idoso cadastrado com sucesso!
✅ Cuidador cadastrado com sucesso!
✅ Familiar cadastrado com sucesso!
✅ Usuário cadastrado com ROLE_USER!
✅ Bloqueio funcionando! Não pode se cadastrar como ADMIN
```

---

## ⚙️ Rotas Temporariamente Liberadas

### **Status Atual (Desenvolvimento):**

```java
// UserController.java
@GetMapping("/{id}")
// @PreAuthorize("isAuthenticated()") ← COMENTADO
public ResponseEntity<User> getUserById(@PathVariable Long id) { ... }
```

**Motivo:** Permitir desenvolvimento das telas sem burocracia de JWT.

### **⚠️ ANTES DE IR PARA PRODUÇÃO:**

1. Descomentar todas as anotações `@PreAuthorize`
2. Descomentar o import do PreAuthorize
3. Testar todas as rotas protegidas
4. Validar que endpoints rejeitam requisições sem token

---

## 🔄 Ativando Proteção das Rotas

Quando estiver pronto para produção:

### **1. UserController.java**

```java
// import org.springframework.security.access.prepost.PreAuthorize; 
// ↓ REMOVER comentário
import org.springframework.security.access.prepost.PreAuthorize;

// @PreAuthorize("isAuthenticated()") 
// ↓ REMOVER comentário
@PreAuthorize("isAuthenticated()")
```

### **2. Testar com Postman:**

```bash
# Sem token → deve retornar 401
GET /api/users/1

# Com token → deve retornar 200
GET /api/users/1
Authorization: Bearer {token}
```

---

## 📊 Matriz de Permissões (Futuro)

Quando ativar proteção, use essa matriz:

| Endpoint | Público | USER | IDOSO | CUIDADOR | FAMILIAR | PROFISSIONAL | ADMIN |
|----------|---------|------|-------|----------|----------|--------------|-------|
| POST /api/auth/signup | ✅ | - | - | - | - | - | - |
| POST /api/auth/login | ✅ | - | - | - | - | - | - |
| GET /api/users/{id} | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/users/email | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/users (listar) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| PUT /api/users/{id} | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| DELETE /api/users/{id} | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎯 Exemplos de Uso

### **Proteger endpoint para apenas IDOSOS:**

```java
@GetMapping("/idoso/dashboard")
@PreAuthorize("hasRole('IDOSO')")
public ResponseEntity<Dashboard> getIdosoDashboard() {
    // ...
}
```

### **Proteger endpoint para IDOSO ou FAMILIAR:**

```java
@GetMapping("/prontuario/{id}")
@PreAuthorize("hasAnyRole('IDOSO', 'FAMILIAR')")
public ResponseEntity<Prontuario> getProntuario(@PathVariable Long id) {
    // ...
}
```

### **Proteger endpoint para qualquer usuário autenticado:**

```java
@GetMapping("/perfil")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<User> getPerfil() {
    // ...
}
```

---

## 🆘 Troubleshooting

### ❌ Erro: "You cannot register with this user type"
**Causa:** Tentou se cadastrar com ROLE_ADMIN ou PROFISSIONAL_SAUDE  
**Solução:** Use apenas IDOSO, CUIDADOR ou FAMILIAR (ou omita o campo)

### ❌ Erro: "Username already exists"
**Causa:** Username já cadastrado no banco  
**Solução:** Use outro username único

### ❌ Erro: "Email already exists"
**Causa:** Email já cadastrado no banco  
**Solução:** Use outro email único

---

## 📚 Arquivos Relacionados

- `SignupDto.java` - DTO com campo roleType opcional
- `AuthServiceImpl.java` - Validação de whitelist
- `RoleType.java` - Enum com todos os tipos
- `UserController.java` - Rotas temporariamente liberadas
- `Postman_Collection_JWT_Auth.json` - Testes atualizados

---

**✅ Sistema de roles implementado e protegido contra ataques!** 🔐

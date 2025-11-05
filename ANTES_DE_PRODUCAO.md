# ⚠️ ANTES DE IR PARA PRODUÇÃO - Checklist de Segurança

## 🔒 Ativar Proteção JWT

### ✅ **Passo 1: SecurityConfig.java**

Arquivo: `backend/src/main/java/br/pucgo/ads/projetointegrador/plataforma/config/SecurityConfig.java`

**Trocar:**
```java
// ❌ DESENVOLVIMENTO (atual)
.requestMatchers("/api/grupo1/**").permitAll()
.requestMatchers("/api/grupo2/**").permitAll()
.requestMatchers("/api/grupo3/**").permitAll()
.requestMatchers("/api/grupo4/**").permitAll()
.requestMatchers("/api/grupo5/**").permitAll()
.requestMatchers("/api/grupo6/**").permitAll()
.requestMatchers("/api/users/**").permitAll()
.anyRequest().permitAll()
```

**Por:**
```java
// ✅ PRODUÇÃO (protegido)
.requestMatchers("/api/grupo1/**").authenticated()
.requestMatchers("/api/grupo2/**").authenticated()
.requestMatchers("/api/grupo3/**").authenticated()
.requestMatchers("/api/grupo4/**").authenticated()
.requestMatchers("/api/grupo5/**").authenticated()
.requestMatchers("/api/grupo6/**").authenticated()
.requestMatchers("/api/users/**").authenticated()
.anyRequest().authenticated()
```

---

### ✅ **Passo 2: UserController.java**

Arquivo: `backend/src/main/java/br/pucgo/ads/projetointegrador/plataforma/controller/UserController.java`

**Descomentar:**
```java
// ❌ DESENVOLVIMENTO (atual)
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize; // TODO
import org.springframework.web.bind.annotation.*;

@GetMapping("/{id}")
// @PreAuthorize("isAuthenticated()")
public ResponseEntity<User> getUserById(@PathVariable Long id) {
```

**Para:**
```java
// ✅ PRODUÇÃO (protegido)
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@GetMapping("/{id}")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<User> getUserById(@PathVariable Long id) {
```

---

### ✅ **Passo 3: Verificar Controllers dos Grupos**

Cada grupo deve adicionar proteção em seus controllers:

```java
@RestController
@RequestMapping("/api/grupo1/medicamentos")
@RequiredArgsConstructor
public class MedicamentoController {
    
    @PostMapping
    @PreAuthorize("isAuthenticated()") // ← Adicionar isso
    public ResponseEntity<...> criar(...) { }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") // ← Adicionar isso
    public ResponseEntity<...> buscar(...) { }
}
```

---

### ✅ **Passo 4: Testar Proteção**

#### **Teste 1: Sem Token (deve falhar)**
```bash
curl http://localhost:8080/api/users/1
```
**Esperado:** ❌ 401 Unauthorized

#### **Teste 2: Com Token (deve funcionar)**
```bash
curl -H "Authorization: Bearer {token}" http://localhost:8080/api/users/1
```
**Esperado:** ✅ 200 OK

#### **Teste 3: Token Inválido (deve falhar)**
```bash
curl -H "Authorization: Bearer token-invalido" http://localhost:8080/api/users/1
```
**Esperado:** ❌ 401 Unauthorized

---

## 🎯 **Por que está liberado no desenvolvimento?**

### ✅ **Vantagens:**
- Grupos podem criar telas/APIs sem precisar lidar com JWT inicialmente
- Facilita prototipagem rápida
- Reduz bloqueios de desenvolvimento
- Frontend pode fazer requests diretos sem configurar tokens

### ⚠️ **Desvantagens:**
- **NÃO pode ir assim para produção!**
- Qualquer um pode acessar qualquer endpoint
- Dados sensíveis ficam expostos

---

## 📊 **Status Atual (Desenvolvimento)**

| Componente | Status | Proteção |
|------------|--------|----------|
| `/api/auth/**` | ✅ Público | Sempre liberado |
| `/api/grupo1/**` | ⚠️ Temporário | `.permitAll()` |
| `/api/grupo2/**` | ⚠️ Temporário | `.permitAll()` |
| `/api/grupo3/**` | ⚠️ Temporário | `.permitAll()` |
| `/api/grupo4/**` | ⚠️ Temporário | `.permitAll()` |
| `/api/grupo5/**` | ⚠️ Temporário | `.permitAll()` |
| `/api/grupo6/**` | ⚠️ Temporário | `.permitAll()` |
| `/api/users/**` | ⚠️ Temporário | `.permitAll()` |
| `anyRequest()` | ⚠️ Temporário | `.permitAll()` |

---

## 📊 **Como Deve Ficar (Produção)**

| Componente | Status | Proteção |
|------------|--------|----------|
| `/api/auth/**` | ✅ Público | `.permitAll()` |
| `/api/grupo1/**` | 🔒 Protegido | `.authenticated()` |
| `/api/grupo2/**` | 🔒 Protegido | `.authenticated()` |
| `/api/grupo3/**` | 🔒 Protegido | `.authenticated()` |
| `/api/grupo4/**` | 🔒 Protegido | `.authenticated()` |
| `/api/grupo5/**` | 🔒 Protegido | `.authenticated()` |
| `/api/grupo6/**` | 🔒 Protegido | `.authenticated()` |
| `/api/users/**` | 🔒 Protegido | `.authenticated()` |
| `anyRequest()` | 🔒 Protegido | `.authenticated()` |

---

## 🔍 **Como Saber se Está Protegido?**

### **Teste Rápido:**

```bash
# 1. Fazer signup/login para obter token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail":"joao@email.com","password":"senha123"}'

# 2. Tentar acessar endpoint SEM token
curl http://localhost:8080/api/users/1

# Se retornar 401 → ✅ Protegido!
# Se retornar 200 → ❌ AINDA LIBERADO (desenvolvimento)
```

---

## 📝 **Checklist Final**

- [ ] SecurityConfig.java: Trocar `.permitAll()` por `.authenticated()`
- [ ] UserController.java: Descomentar `@PreAuthorize`
- [ ] Descomentar import do PreAuthorize
- [ ] Testar endpoint sem token (deve retornar 401)
- [ ] Testar endpoint com token (deve retornar 200)
- [ ] Testar endpoint com token inválido (deve retornar 401)
- [ ] Avisar todos os grupos para adicionar `@PreAuthorize` em seus controllers
- [ ] Atualizar documentação do projeto
- [ ] Remover este arquivo (ANTES_DE_PRODUCAO.md) após ativar segurança

---

## 🆘 **Problemas Comuns**

### ❌ Erro: "No converter found for return value"
**Causa:** Anotação `@RestController` faltando  
**Solução:** Adicionar `@RestController` no controller

### ❌ Erro: "401 Unauthorized" mesmo com token válido
**Causa:** Token não está sendo enviado no header correto  
**Solução:** Verificar header: `Authorization: Bearer {token}`

### ❌ Erro: "403 Forbidden"
**Causa:** Token válido mas usuário não tem a role necessária  
**Solução:** Verificar `@PreAuthorize` e roles do usuário

---

## 📚 **Documentação Relacionada**

- `SISTEMA_ROLES.md` - Sistema de roles e permissões
- `TESTE_JWT_POSTMAN.md` - Como testar JWT com Postman
- `GUIA_DESENVOLVEDORES_GRUPOS.md` - Como desenvolver com proteção

---

**⚠️ NÃO ESQUEÇA DE ATIVAR A SEGURANÇA ANTES DE PRODUÇÃO!** 🔒

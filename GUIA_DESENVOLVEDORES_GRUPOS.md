# 👥 Guia para Desenvolvedores dos Grupos

> **Objetivo:** Este guia orienta desenvolvedores dos **Grupos 1 a 6** sobre como começar a trabalhar no projeto, entender a estrutura e criar suas funcionalidades.

---

## 📋 Índice

1. [Pré-requisitos](#-pré-requisitos)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Como Começar](#-como-começar)
4. [Seu Espaço de Trabalho](#-seu-espaço-de-trabalho)
5. [Criando sua Primeira Funcionalidade](#-criando-sua-primeira-funcionalidade)
6. [Usando Autenticação JWT](#-usando-autenticação-jwt)
7. [Testando sua API](#-testando-sua-api)
8. [Boas Práticas](#-boas-práticas)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ **Java 21** ([Download](https://adoptium.net/))
- ✅ **Maven 3.9+** (vem com o IntelliJ IDEA)
- ✅ **PostgreSQL 17.2** ([Download](https://www.postgresql.org/download/))
- ✅ **Node.js 23+** (para frontend - opcional no início)
- ✅ **IDE recomendada:** IntelliJ IDEA ou VS Code
- ✅ **Postman** (para testar APIs)

### Configuração Inicial

Consulte o arquivo principal **`README.md`** para:
- Configurar o banco de dados PostgreSQL
- Entender a arquitetura geral do projeto
- Ver os tipos de usuário (RoleType)

---

## 📁 Estrutura do Projeto

```
📁 projeto-integrador/
├── 📁 backend/
│   └── 📁 src/main/java/br/pucgo/ads/projetointegrador/
│       ├── 📁 plataforma/          ← Autenticação JWT (NÃO MEXER)
│       │   ├── config/             ← SecurityConfig, JwtAuthenticationFilter
│       │   ├── controller/         ← AuthController, UserController
│       │   ├── dto/                ← LoginDto, SignupDto, JwtAuthResponse
│       │   ├── entity/             ← User, RoleType
│       │   ├── repository/         ← UserRepository
│       │   ├── security/           ← JwtTokenProvider, CustomUserDetailsService
│       │   └── service/            ← AuthService, UserService
│       │
│       ├── 📁 grupo1/              ← SEU GRUPO (exemplo)
│       │   ├── controller/         ← Seus Controllers (APIs REST)
│       │   ├── service/            ← Sua lógica de negócio
│       │   ├── repository/         ← Acesso ao banco de dados
│       │   ├── entity/             ← Suas tabelas (JPA Entities)
│       │   └── dto/                ← Objetos de transferência de dados
│       │
│       ├── 📁 grupo2/              ← Grupo 2
│       ├── 📁 grupo3/              ← Grupo 3
│       ├── 📁 grupo4/              ← Grupo 4
│       ├── 📁 grupo5/              ← Grupo 5
│       └── 📁 grupo6/              ← Grupo 6
│
├── 📁 frontend/                    ← Interface React (opcional no início)
├── 📄 pom.xml                      ← Dependências Maven
├── 📄 README.md                    ← Informações gerais
└── 📄 TESTE_JWT_POSTMAN.md         ← Como testar autenticação
```

---

## 🚀 Como Começar

### 1️⃣ **Clone o Repositório**

```bash
git clone https://github.com/projeto-integrador-puc-ads/Projeto-Integrador.git
cd Projeto-Integrador
```

### 2️⃣ **Configure o Banco de Dados**

Crie o banco de dados PostgreSQL:

```sql
CREATE DATABASE projeto_integrador;
```

Edite o arquivo **`backend/src/main/resources/application.properties`**:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/projeto_integrador
spring.datasource.username=postgres 
spring.datasource.password=SUA_SENHA_AQUI
```

### 3️⃣ **Compile e Execute o Projeto**

Na raiz do projeto:

```bash
# Compilar (primeira vez)
mvn clean install

# Executar aplicação
mvn spring-boot:run
```

**✅ Aplicação rodando em:** `http://localhost:8080`

### 4️⃣ **Verifique se Funcionou**

Abra o navegador ou Postman:

```
GET http://localhost:8080/api/auth/login
```

Se retornar erro `405 Method Not Allowed` → **Está funcionando!** (precisa usar POST)

---

## 🎯 Seu Espaço de Trabalho

### Regras de Ouro

1. **Trabalhe APENAS na pasta do seu grupo** (`grupo1/`, `grupo2/`, etc.)
2. **NÃO modifique** a pasta `plataforma/` (autenticação compartilhada)
3. **NÃO mexa** nas pastas de outros grupos
4. **Use Git branches** para suas features: `feature/grupo1-cadastro-medicamento`

### Seu Grupo é Responsável Por:

- ✅ Criar suas próprias **Entities** (tabelas do banco)
- ✅ Criar seus próprios **Repositories** (acesso ao banco)
- ✅ Criar seus próprios **Services** (lógica de negócio)
- ✅ Criar seus próprios **Controllers** (APIs REST)
- ✅ Criar seus próprios **DTOs** (transferência de dados)

---

## 🔐 Usando Autenticação JWT

### Como Funciona a Autenticação

O **Grupo Plataforma** já implementou toda a autenticação JWT. Você só precisa **usar**!

### Endpoints de Autenticação Disponíveis

| Endpoint | Método | Descrição | Público? |
|----------|--------|-----------|----------|
| `/api/auth/signup` | POST | Registrar novo usuário | ✅ Sim |
| `/api/auth/login` | POST | Fazer login e obter token | ✅ Sim |
| `/api/users/{id}` | GET | Buscar usuário por ID | 🔒 Requer JWT |
| `/api/users/email/{email}` | GET | Buscar usuário por email | 🔒 Requer JWT |

### Fluxo de Autenticação

```
1. Frontend → POST /api/auth/signup (cadastro)
2. Frontend → POST /api/auth/login (login)
3. Backend → Retorna { "accessToken": "eyJhbGc...", "tokenType": "Bearer" }
4. Frontend → Salva token no localStorage
5. Frontend → Envia token em TODAS as requisições: Authorization: Bearer {token}
6. Suas APIs → Verificam automaticamente se o token é válido
```

### Protegendo Seus Endpoints

Use a anotação `@PreAuthorize`:

```java
// Qualquer usuário autenticado pode acessar
@PreAuthorize("isAuthenticated()")
public ResponseEntity<...> meuEndpoint() { ... }

// Apenas ADMIN pode acessar
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<...> endpointAdmin() { ... }

// Apenas IDOSO pode acessar
@PreAuthorize("hasRole('IDOSO')")
public ResponseEntity<...> endpointIdoso() { ... }
```

### RoleTypes Disponíveis

Configurados no enum `RoleType`:
- `ROLE_USER` (padrão para novos cadastros)
- `ROLE_ADMIN`
- `IDOSO`
- `CUIDADOR`
- `FAMILIAR`
- `PROFISSIONAL_SAUDE`

---

## 🧪 Testando sua API

### 1️⃣ **Registrar um Usuário**

```bash
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "name": "Maria Silva",
  "username": "maria.silva",
  "email": "maria@email.com",
  "password": "senha123"
}
```

**Resposta:** `201 Created`

### 2️⃣ **Fazer Login**

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "maria@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

**🔑 COPIE O TOKEN!** Você vai precisar dele.

### 3️⃣ **Testar sua API Protegida**

```bash
POST http://localhost:8080/api/grupo1/medicamentos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "nome": "Paracetamol",
  "descricao": "Analgésico e antitérmico",
  "dosagem": "500mg",
  "usuarioId": 1,
  "horarioAdministracao": "08:00, 14:00, 20:00"
}
```

**Resposta:** `201 Created` com dados do medicamento

### 4️⃣ **Usar Postman**

1. Importe a collection: `Postman_Collection_JWT_Auth.json`
2. Configure o environment: `Postman_Environment_JWT.json`
3. Faça login para obter o token automaticamente
4. Crie suas próprias requests na pasta do seu grupo

---

## ✅ Boas Práticas

### Nomenclatura de Endpoints

Siga o padrão REST:

```
/api/{seu-grupo}/{recurso}

Exemplos:
- /api/grupo1/medicamentos
- /api/grupo2/consultas
- /api/grupo3/exercicios
- /api/grupo4/alimentacao
- /api/grupo5/emergencias
- /api/grupo6/relatorios
```

### Versionamento de API (opcional)

```
/api/v1/grupo1/medicamentos
```

### Tratamento de Erros

Crie classes de exceção personalizadas:

```java
package br.pucgo.ads.projetointegrador.grupo1.exception;

public class MedicamentoNotFoundException extends RuntimeException {
    public MedicamentoNotFoundException(String message) {
        super(message);
    }
}
```

### Validações

Use anotações de validação:

```java
@NotBlank(message = "Campo obrigatório")
@Email(message = "Email inválido")
@Size(min = 3, max = 100, message = "Tamanho inválido")
@Pattern(regexp = "...", message = "Formato inválido")
```

### Documentação de API

Adicione comentários Javadoc:

```java
/**
 * Cria um novo medicamento para o usuário.
 * 
 * @param dto Dados do medicamento
 * @return Medicamento criado com ID gerado
 */
@PostMapping
public ResponseEntity<MedicamentoResponseDTO> criar(@Valid @RequestBody MedicamentoRequestDTO dto) {
    // ...
}
```

---

## 📚 Recursos Úteis

- 📖 **README.md** - Visão geral do projeto
- 🧪 **TESTE_JWT_POSTMAN.md** - Como testar autenticação
- 🌐 **Spring Boot Docs:** [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
- 🔐 **JWT:** [https://jwt.io/](https://jwt.io/)
- 🗄️ **JPA/Hibernate:** [https://hibernate.org/](https://hibernate.org/)

---

## 🆘 Problemas Comuns

### Erro: "Cannot create table... already exists"

Configure no `application.properties`:

```properties
spring.jpa.hibernate.ddl-auto=update
```

### Erro: "Could not autowire MedicamentoRepository"

Verifique se tem as anotações:
- `@Repository` no Repository
- `@Service` no Service
- `@RestController` no Controller

### Token JWT não funciona

1. Verifique se está enviando: `Authorization: Bearer {token}`
2. Verifique se o token não expirou (7 dias)
3. Veja os logs da aplicação

---

## 🎯 Checklist para Começar

- [ ] Java 21 instalado
- [ ] PostgreSQL configurado
- [ ] Banco `projeto_integrador` criado
- [ ] Arquivo `application.properties` configurado
- [ ] Aplicação roda sem erros (`mvn spring-boot:run`)
- [ ] Consegue fazer signup e login
- [ ] Postman configurado
- [ ] Estrutura de pastas do seu grupo criada
- [ ] Primeira Entity criada
- [ ] Primeiro Controller funcionando

---

## 🚀 Próximos Passos

1. ✅ Clone o repositório
2. ✅ Configure o banco de dados
3. ✅ Execute a aplicação
4. ✅ Teste autenticação no Postman
5. ✅ Crie sua primeira Entity
6. ✅ Crie seu primeiro CRUD
7. ✅ Teste suas APIs
8. ✅ Faça commit e push

---

**💡 Dica Final:** Comece simples! Crie primeiro um CRUD básico e depois adicione funcionalidades complexas.

**🤝 Dúvidas?** Consulte os outros grupos ou peça ajuda no grupo do WhatsApp da turma.

---

**Bom desenvolvimento! 🚀**

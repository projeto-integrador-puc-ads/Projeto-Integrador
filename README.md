# Plataforma de Auxílio ao Idoso

**PUC GO (ADS)** - Uma plataforma digital desenvolvida para auxiliar idosos em seu dia a dia, promovendo autonomia, bem-estar e inclusão.

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

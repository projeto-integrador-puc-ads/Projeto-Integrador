# DoseCerta - MedicamentosApp

DoseCerta é um aplicativo Android desenvolvido em Kotlin para ajudar os usuários a cadastrar, gerenciar e acompanhar seus medicamentos, utilizando integração com Firebase Authentication, Firestore e Storage.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Arquitetura e Organização](#arquitetura-e-organização)
- [Fluxo de Uso](#fluxo-de-uso)
- [Principais Classes e Componentes](#principais-classes-e-componentes)
- [Layouts e Recursos](#layouts-e-recursos)
- [Dependências](#dependências)
- [Customização e Extensões](#customização-e-extensões)
- [Autores](#autores)

---

## Funcionalidades

- **Cadastro e login de usuários** (com Firebase Authentication)
- **Adição de medicamentos** (nome, dosagem, frequência, quantidade, imagem, contato de emergência)
- **Listagem dos medicamentos cadastrados**
- **Detalhes de cada medicamento**, incluindo lembretes com TimePicker
- **Upload de imagens** dos medicamentos (usando Firebase Storage)
- **Logout seguro**
- **Interface moderna** com layouts customizados

---

## Arquitetura e Organização

O projeto segue uma organização modular utilizando repositórios para separar as lógicas de autenticação, manipulação de dados e armazenamento de imagens.

```
com.dosecerta.medicamentosapp/
    data/
        AuthRepository.kt
        MedicamentosRepository.kt
        StorageRepository.kt
    model/
        Medicamento.kt
    ui.theme/
        Colors.kt
        Theme.kt
        Type.kt
    MainActivity.kt
    LoginActivity.kt
    CadastroUsuarioActivity.kt
    CadastroMedicamentoActivity.kt
    MedicamentosActivity.kt
    DetalhesMedicamentoActivity.kt
    PerfilActivity.kt
    RepositorioDeMedicamentos.kt
res/
    layout/
    values/
    drawable/
```

---

## Fluxo de Uso

1. **Tela Inicial/MainActivity**: Verifica se o usuário está autenticado. Redireciona para `MedicamentosActivity` (caso logado) ou para `LoginActivity`.
2. **LoginActivity**: Permite ao usuário realizar login ou navegar para cadastro.
3. **CadastroUsuarioActivity**: Tela para registro de novo usuário.
4. **MedicamentosActivity**: Exibe lista de medicamentos cadastrados e permite adicionar um novo.
5. **CadastroMedicamentoActivity**: Formulário para cadastrar um novo medicamento.
6. **DetalhesMedicamentoActivity**: Mostra detalhes, horário do lembrete, foto e permite ativar lembrete.
7. **PerfilActivity**: Exibe nome, email e permite logout.

---

## Principais Classes e Componentes

### 1. **AuthRepository**
- Gerencia autenticação de usuários (login, cadastro e logout).
- Usa `FirebaseAuth` para todas operações.

### 2. **MedicamentosRepository**
- CRUD de medicamentos no Firestore, por usuário autenticado.
- Permite adicionar e escutar/listar medicamentos em tempo real.

### 3. **StorageRepository**
- Realiza upload de imagens dos medicamentos no Firebase Storage.

### 4. **Medicamento (Model)**
- Representa os dados de um medicamento.

### 5. **Activities**
- **MainActivity**: Tela de routing inicial.
- **LoginActivity**: Formulário de login.
- **CadastroUsuarioActivity**: Formulário de cadastro.
- **MedicamentosActivity**: Lista geral + botão adicionar.
- **CadastroMedicamentoActivity**: Formulário de novo medicamento.
- **DetalhesMedicamentoActivity**: Detalhes, foto, lembrete.
- **PerfilActivity**: Dados do usuário e logout.

### 6. **Layouts**
- XMLs customizados para cada Activity, com elementos temáticos (cores, backgrounds, botões customizados).
- Uso de `ListView`, `EditText`, `Button`, `ImageView`, `TimePicker`, `Switch`, etc.

### 7. **Temas**
- Pastas e arquivos em `ui.theme` definem o tema Material 3 customizado para o app.

---

## Layouts e Recursos

- **activity_login.xml**: Tela de login estilizada com gradiente e container branco curvo.
- **activity_cadastro_usuario.xml**: Cadastro de usuário com ConstraintLayout.
- **activity_cadastro_medicamento.xml**: Formulário para novo medicamento com imagem.
- **activity_medicamentos.xml**: Lista de medicamentos.
- **activity_detalhes_medicamento.xml**: Detalhes, foto e lembrete.
- **activity_perfil.xml**: Dados de perfil e logout.

Outros recursos:
- Cores customizadas em `/res/values/colors.xml`
- Strings em `/res/values/strings.xml`
- Drawables customizados para backgrounds, botões e campos.

---

## Dependências

- **Firebase Auth** (login/cadastro)
- **Firebase Firestore** (armazenamento de medicamentos)
- **Firebase Storage** (upload de imagens)
- **Material3** (temas e layouts modernos)
- **AndroidX** (AppCompat, ConstraintLayout, ListView, etc.)

---

## Customização e Extensões

- **Adicionar campos**: Basta atualizar o model `Medicamento` e os formulários correspondentes.
- **Notificações/Lembretes**: Pode-se integrar com `AlarmManager` ou WorkManager para notificações reais.
- **Contato de emergência**: Campo já previsto no model, pode ser expandido para envio de SMS/emails automáticos.
- **Versão Compose**: O tema já possui suporte para Material 3 e pode ser adaptado para Jetpack Compose.

---

## Autores

- Antonio Neto ([AntonioNeto504](https://github.com/AntonioNeto504))
- Contribuições são bem-vindas!

---

## Licença

Este projeto é de uso acadêmico/demonstrativo. Consulte o autor para fins comerciais.

```
**Observação:** O app depende de configuração prévia do Firebase (google-services.json), permissões de internet, e permissões de câmera/armazenamento para upload de imagens.
```
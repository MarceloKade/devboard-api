# DevBoard API

API REST do **DevBoard**, uma aplicação para gerenciamento de projetos, tarefas e membros de equipe.

O backend foi desenvolvido com **NestJS, Prisma e PostgreSQL**, utilizando autenticação baseada em **JWT** e verificação de e-mail através do **Resend**.

## Tecnologias

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcrypt
- Schedule
- Resend
- Docker

## Funcionalidades

- Cadastro de usuários
- Validação de e-mail no cadastro
- Envio de e-mail de confirmação
- Confirmação de e-mail através de link
- Link de confirmação válido por 48 horas
- Bloqueio de login para usuários não verificados
- Exclusão automática de contas não verificadas após a expiração
- Login com autenticação JWT
- Consulta e atualização de perfil
- Criação, edição, consulta e exclusão de projetos
- Criação, edição, consulta e exclusão de tarefas
- Controle de status e prioridade das tarefas
- Gerenciamento de membros dos projetos
- Controle de roles dos membros
- Histórico de atividades dos projetos
- Proteção das rotas com JWT

## Estrutura do projeto

```text
src/

├── auth/
├── prisma/
├── project-activities/
├── project-members/
├── projects/
├── tasks/
├── users/
├── app.module.ts
└── main.ts
```

## Requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js 22+
- Docker
- Git

## Instalação

Clone o repositório:

```bash
git clone https://github.com/MarceloKade/devboard-api.git
```

Entre na pasta:

```bash
cd devboard-api
```

Instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://devboard:devboard@localhost:5432/devboard?schema=public"

DIRECT_URL="postgresql://devboard:devboard@localhost:5432/devboard?schema=public"

JWT_SECRET="devboard-super-secret-key-change-this-later"

BASE_URL="http://localhost:3001"

FRONTEND_URL="http://localhost:3000"

RESEND_API_KEY=""

ACCESS_TOKEN=""

ACCESS_TOKEN2=""

USER_ID=""

USER2_ID=""

PROJECT_ID=""

TASK_ID=""

MEMBER_ID=""

MEMBER2_ID=""
```

### Variáveis principais

- `DATABASE_URL` — conexão utilizada pela aplicação com o PostgreSQL.
- `DIRECT_URL` — conexão direta utilizada pelo Prisma para operações relacionadas às migrations.
- `JWT_SECRET` — chave utilizada para assinatura dos tokens JWT.
- `BASE_URL` — URL da API.
- `FRONTEND_URL` — URL do frontend utilizada nos links de confirmação de e-mail.
- `RESEND_API_KEY` — chave da API do Resend utilizada para envio dos e-mails.

As variáveis `ACCESS_TOKEN`, `USER_ID`, `PROJECT_ID` e outras utilizadas pelos arquivos `.http` são auxiliares para facilitar os testes da API.

> Nunca versione o arquivo `.env` ou exponha chaves secretas no repositório.

## Banco de dados

O projeto utiliza PostgreSQL.

Para iniciar o banco utilizando Docker:

```bash
docker compose up -d
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Gere o Prisma Client:

```bash
npx prisma generate
```

## Executando a aplicação

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

A API estará disponível em:

```text
http://localhost:3001
```

## Verificação de e-mail

Após o cadastro, o usuário recebe um e-mail de confirmação através do **Resend**.

O fluxo funciona da seguinte forma:

```text
Cadastro
   ↓
Usuário criado como não verificado
   ↓
Token de verificação gerado
   ↓
E-mail enviado pelo Resend
   ↓
Usuário acessa o link
   ↓
E-mail confirmado
   ↓
Login liberado
```

O token de confirmação possui validade de **48 horas**.

Caso o usuário não confirme o e-mail dentro desse período, a conta é removida automaticamente pelo serviço de limpeza agendada.

A limpeza é executada periodicamente pelo sistema de tarefas agendadas do NestJS.

## Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação.

Primeiro, registre um usuário:

```http
POST /auth/register
```

Depois de confirmar o e-mail, faça login:

```http
POST /auth/login
```

O login retorna um access token que deve ser enviado nas requisições protegidas:

```http
Authorization: Bearer <access_token>
```

Usuários que ainda não confirmaram o e-mail não podem realizar login.

## Principais endpoints

### Auth

```text
POST /auth/register
POST /auth/login
GET  /auth/verify-email?token=<token>
```

### Users

```text
GET    /users
GET    /users/me
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

### Projects

```text
POST   /projects
GET    /projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id
```

### Tasks

```text
POST   /projects/:projectId/tasks
GET    /projects/:projectId/tasks
GET    /projects/:projectId/tasks/:taskId
PATCH  /projects/:projectId/tasks/:taskId
DELETE /projects/:projectId/tasks/:taskId
```

### Project Members

```text
POST   /projects/:projectId/members
GET    /projects/:projectId/members
PATCH  /projects/:projectId/members/:memberId
DELETE /projects/:projectId/members/:memberId
```

### Project Activities

```text
GET /projects/:projectId/activities
```

O histórico registra ações realizadas no projeto, como:

- criação e atualização de projetos;
- criação, alteração e exclusão de tarefas;
- alteração de status e prioridade;
- adição, alteração e remoção de membros.

## Testando a API

O projeto possui arquivos `.http` para facilitar os testes das rotas:

```text
api/

├── auth.http
└── project-activities.http
├── project-members.http
├── projects.http
├── tasks.http
├── users.http
```

Eles podem ser executados diretamente pelo suporte de requisições HTTP da IDE.

## Autor

**Marcelo Kade**

- GitHub: https://github.com/MarceloKade
- LinkedIn: https://www.linkedin.com/in/marcelokade/

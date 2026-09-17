# DevBoard API

API REST do **DevBoard**, uma aplicação para gerenciamento de projetos, tarefas e membros de equipe.

O backend foi desenvolvido com NestJS, Prisma e PostgreSQL, utilizando autenticação baseada em JWT.

## Tecnologias

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcrypt
- class-validator
- Docker

## Funcionalidades

- Cadastro de usuários
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
├── users/
├── projects/
├── tasks/
├── project-members/
├── project-activities/
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

JWT_SECRET="devboard-super-secret-key-change-this-later"

BASE_URL="http://localhost:3001"

ACCESS_TOKEN=""
ACCESS_TOKEN2=""

USER_ID=""
USER2_ID=""

PROJECT_ID=""
TASK_ID=""

MEMBER_ID=""
MEMBER2_ID=""
```

As variáveis `ACCESS_TOKEN`, `USER_ID`, `PROJECT_ID` e outras utilizadas pelos arquivos `.http` são auxiliares para facilitar os testes da API.

## Banco de dados

O projeto utiliza PostgreSQL.

Para iniciar o banco utilizando Docker, execute:

```bash
docker compose up -d
```

Depois, execute as migrations:

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

## Autenticação

A API utiliza **JWT (JSON Web Token)** para autenticação.

Primeiro, registre um usuário:

```http
POST /auth/register
```

Depois faça login:

```http
POST /auth/login
```

O login retorna um access token que deve ser enviado nas requisições protegidas:

```http
Authorization: Bearer <access_token>
```

## Principais endpoints

### Auth

```text
POST   /auth/register
POST   /auth/login
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
├── users.http
├── projects.http
├── tasks.http
├── project-members.http
└── project-activities.http
```

Eles podem ser executados diretamente pelo suporte de requisições HTTP da IDE.

## Frontend

O frontend do DevBoard foi desenvolvido separadamente utilizando React e TanStack Start.

Repositório:

https://github.com/MarceloKade/devboard-web

## Autor

**Marcelo Kade**

- GitHub: https://github.com/MarceloKade
- LinkedIn: https://www.linkedin.com/in/marcelokade/

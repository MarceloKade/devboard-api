# DevBoard API

API REST do **DevBoard**, uma aplicação para gerenciamento de projetos, tarefas e membros de equipe.

O backend foi desenvolvido com **NestJS, Prisma e PostgreSQL**, utilizando autenticação baseada em **JWT**, verificação de e-mail através de **Gmail SMTP com Nodemailer** e armazenamento de avatares através do **Supabase Storage**.

## Tecnologias

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcrypt
- Schedule
- Nodemailer
- Supabase Storage
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
- Upload de avatar
- Armazenamento de avatar utilizando Supabase Storage
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

EMAIL_HOST="smtp.gmail.com"

EMAIL_PORT="465"

EMAIL_SECURE="true"

EMAIL_USER="seu-email@gmail.com"

EMAIL_PASSWORD="sua-senha-de-app"

EMAIL_FROM="DevBoard <seu-email@gmail.com>"

SUPABASE_URL=""

SUPABASE_SECRET_KEY=""

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
- `EMAIL_HOST` — servidor SMTP utilizado para envio dos e-mails.
- `EMAIL_PORT` — porta utilizada pelo servidor SMTP.
- `EMAIL_SECURE` — define o uso de conexão SMTP segura.
- `EMAIL_USER` — endereço de e-mail utilizado para envio.
- `EMAIL_PASSWORD` — senha de app utilizada para autenticação SMTP.
- `EMAIL_FROM` — remetente exibido nos e-mails enviados.
- `SUPABASE_URL` — URL do projeto Supabase utilizado para armazenamento dos arquivos.
- `SUPABASE_SECRET_KEY` — chave secreta utilizada pelo backend para acessar o Supabase Storage.

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

## Supabase Storage

Os avatares dos usuários são armazenados no **Supabase Storage**.

O backend utiliza um bucket chamado `avatars` para armazenar as imagens.

As imagens possuem limite de **5 MB** e os formatos aceitos são:

- JPEG
- PNG
- WEBP

Após o upload, o backend gera a URL pública do arquivo e salva essa URL no campo `avatar` do usuário.

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

Após o cadastro, o usuário recebe um e-mail de confirmação enviado através do **Gmail SMTP utilizando Nodemailer**.

O fluxo funciona da seguinte forma:

```text
Cadastro
   ↓
Usuário criado como não verificado
   ↓
Token de verificação gerado
   ↓
E-mail enviado pelo Gmail SMTP
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

## Aprendizados e decisões técnicas

Durante o desenvolvimento do projeto, algumas decisões técnicas foram revistas conforme as necessidades da aplicação e as limitações das ferramentas utilizadas.

### Envio de e-mails

Inicialmente, o projeto utilizava o **Resend** para o envio dos e-mails de confirmação de cadastro.

Durante os testes, foi identificada uma limitação do plano gratuito relacionada ao envio de e-mails para destinatários. Essa limitação não atendia ao fluxo de cadastro e verificação de e-mail da aplicação.

Como alternativa, o envio foi migrado para **Gmail SMTP utilizando Nodemailer**.

A mudança permitiu manter o fluxo de confirmação de e-mail funcionando e proporcionou experiência prática com configuração de SMTP, autenticação por senha de aplicativo, envio de e-mails pelo backend e gerenciamento de credenciais através de variáveis de ambiente.

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
PATCH  /users/me/avatar
DELETE /users/:id
```

O endpoint de avatar recebe uma imagem através de `multipart/form-data`:

```text
PATCH /users/me/avatar
```

Campo do arquivo:

```text
avatar
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
├── project-activities.http
├── project-members.http
├── projects.http
├── tasks.http
└── users.http
```

Eles podem ser executados diretamente pelo suporte de requisições HTTP da IDE.

## Autor

**Marcelo Kade**

- GitHub: https://github.com/MarceloKade
- LinkedIn: https://www.linkedin.com/in/marcelokade/

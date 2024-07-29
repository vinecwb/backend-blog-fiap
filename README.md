# Backend Blog FIAP

Bem-vindo ao repositório do projeto **Backend Blog FIAP**. Este é um backend para um sistema de blog desenvolvido com Node.js, Express e Prisma. Ele inclui funcionalidades básicas de CRUD para posts e usuários, além de autenticação com JWT.

## Documentação Técnica Detalhada

Este projeto é uma API RESTful que gerencia posts e usuários de um blog. Ele utiliza PostgreSQL como banco de dados principal e testes. A API oferece endpoints para criação, leitura, atualização e exclusão de posts e usuários, além de autenticação e autorização usando JWT.

### Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework para construção de APIs.
- **Prisma**: ORM para gerenciamento de banco de dados.
- **PostgreSQL**: Banco de dados principal.
- **JWT (JSON Web Token)**: Para autenticação e autorização.
- **Jest e Supertest**: Para testes automatizados da API.

## Setup Inicial

Para configurar e executar o projeto localmente, siga os passos abaixo:

### 1. Clonar o Repositório

```bash
git clone https://github.com/vinecwb/backend-blog-fiap.git
cd backend-blog-fiap
```

### 2. Instalar Dependências
Certifique-se de ter o Node.js e npm instalados. Então, instale as dependências do projeto:
```bash
npm install
```
### 3. Configurar o Banco de Dados
Crie um arquivo .env na raiz do projeto e adicione as variáveis de ambiente necessárias:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/my-blog"
DATABASE_URL_TEST="postgresql://user:password@localhost:5432/my-blog-test"
JWT_SECRET="your_jwt_secret_key"
```

### 4. Executar Migrations
```bash
npx prisma migrate dev --schema=prisma/schema.test.prisma
```

### 5. Iniciar o Servidor
```bash
npm start
```
O servidor estará disponível em http://localhost:3000.


### 6. Executar Testes
```bash
npm test
```

## Arquitetura da Aplicação

### Estrutura de Pastas

- **`src/`**: Contém o código fonte da aplicação.
  - **`routes/`**: Contém os arquivos de rotas para a API.
    - **`auth.js`**: Rotas relacionadas à autenticação.
    - **`posts.js`**: Rotas relacionadas aos posts do blog.
    - **`users.js`**: Rotas relacionadas aos usuários.
  - **`controllers/`**: Contém a lógica de controle para cada rota.
  - **`models/`**: Contém os modelos do Prisma para interagir com o banco de dados.
  - **`middleware/`**: Contém middlewares, como autenticação JWT.
  - **`config/`**: Contém arquivos de configuração, como configuração do banco de dados.
  - **`index.js`**: Arquivo principal para iniciar o servidor Express.

### Fluxo de Dados

1. **Cliente** faz uma requisição HTTP para um endpoint da API.
2. O **Express** roteia a requisição para o **Controller** apropriado.
3. O **Controller** processa a requisição, possivelmente interage com o **Prisma** para acessar o banco de dados.
4. O **Prisma** realiza as operações no banco de dados e retorna os dados para o **Controller**.
5. O **Controller** envia a resposta de volta para o **Cliente**.

## Guia de Uso das APIs

### Autenticação

#### `POST /login`

Realiza o login do usuário e retorna um token JWT.

**Request:**

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "your_jwt_token"
}
```

### Rotas de Usuário

#### `GET /users`

Obtém uma lista de todos os usuários.

**Response:**
```json
[
  {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "createdAt": "2024-07-28T12:00:00.000Z",
    "updatedAt": "2024-07-28T12:00:00.000Z"
  }
]
```

### Rotas de Post

#### `POST /post`
Cria um novo post.

**Request:**

```http
POST /post
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "published": false,
  "authorId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "published": false,
  "authorId": 1,
  "createdAt": "2024-07-28T12:00:00.000Z",
  "updatedAt": "2024-07-28T12:00:00.000Z"
}

```
#### `PUT /post/:id/publish`
Aprova um post.

**Request:**

```http
PUT /post/1/publish
Content-Type: application/json
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "id": 1,
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "published": true,
  "authorId": 1,
  "createdAt": "2024-07-28T12:00:00.000Z",
  "updatedAt": "2024-07-28T12:00:00.000Z"
}
```

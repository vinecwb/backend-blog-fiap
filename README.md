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

- **`prisma/`**: Contem o gerenciamento do banco de dados.
  - **`migrations/`**: Armazena todas as migrações do banco de dados.
  - **`schema.prisma`**: Descreve a estrutura dos dados e suas relações.
  - **`schema.test.prisma`**: Estrutura de dados de produção em ambiente de teste.
- **`src/`**: Contém o código fonte da aplicação.
    - **`routes/`**: Contém os arquivos de rotas para a API.
    - **`auth.js`**: Rotas relacionadas à autenticação.
  - **`auth.js`**: Configuração de hash para o password.
  - **`index.js`**: Arquivo principal para iniciar o servidor Express.
- **`tests/`**: Contém o arquivo que irá fazer os testes automatizados pelo jest.
  - **`user.test.js`**: Arquivo para automação dos testes.
- **`.babelrc`**: Arquivo de configuração para transpilar código.
- **`.env.test`**: Arquivo para salvar variáveis de ambiente de teste.
- **`.eslintrc.json`**: Arquivo de configuração do ESLint.
- **`docker-compose.yml`**: Define e configura múltiplos containers Docker para a aplicação.
- **`Dockerfile`**: Script para criar uma imagem Docker com a configuração e dependências da aplicação.
- **`jest.config.cjs`**: Configura o comportamento do Jest para testes JavaScript.
- **`jest.setup.js`**: Configura e inicializa o ambiente de testes antes da execução dos testes.
- **`package-lock.json`**: Registra as versões exatas das dependências instaladas para garantir consistência.
- **`package.json`**: Manifesto do projeto Node.js que define dependências, scripts e informações do projeto.
- **`test-env`**: Define variáveis de ambiente específicas para o ambiente de testes.
- **`README.md`**: Documento que fornece uma visão geral, instruções e informações importantes sobre o projeto.


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

#### `GET/posts`
Consultar posts (lista)

**Request:**
```http
GET /posts
Content-Type: application/json
```

**RESPONSE**
```json
[
    {
        "id": 1,
        "title": "I am Bob",
        "content": null,
        "published": true,
        "authorId": 1,
        "createdAt": "2024-07-28T21:51:33.629Z",
        "updatedAt": "2024-07-28T21:51:51.714Z",
        "author": {
            "id": 1,
            "email": "bob@prisma.io",
            "name": "Bob",
            "createdAt": "2024-07-28T21:51:27.728Z",
            "updatedAt": "2024-07-28T21:51:27.728Z"
        }
    }
]
```
#### `GET/posts/id`
Consulta um post por um id específico

**Request** 
```http
GET /posts/:id
Content-Type: application/json
```

**Response**
```json
{
    "id": 4,
    "title": "I am Bob",
    "content": null,
    "published": false,
    "authorId": 13,
    "createdAt": "2024-07-28T20:27:25.797Z",
    "updatedAt": "2024-07-28T20:27:25.797Z"
}
```
#### `GET/posts/admin`
Visualizar todos os posts, aprovados/não aprovados

**Request** 
```http
GET /posts/admin
Content-Type: application/json
```

**Response**
```json
[
    {
        "id": 1,
        "title": "I am Bob",
        "content": null,
        "published": true,
        "authorId": 1,
        "createdAt": "2024-07-28T21:51:33.629Z",
        "updatedAt": "2024-07-28T21:51:51.714Z",
        "author": {
            "id": 1,
            "email": "bob@prisma.io",
            "name": "Bob",
            "createdAt": "2024-07-28T21:51:27.728Z",
            "updatedAt": "2024-07-28T21:51:27.728Z"
        }
    },
    {
        "id": 2,
        "title": "Tec Bob",
        "content": "Tecnologia",
        "published": false,
        "authorId": 1,
        "createdAt": "2024-07-28T22:03:01.742Z",
        "updatedAt": "2024-07-28T22:03:01.742Z",
        "author": {
            "id": 1,
            "email": "bob@prisma.io",
            "name": "Bob",
            "createdAt": "2024-07-28T21:51:27.728Z",
            "updatedAt": "2024-07-28T21:51:27.728Z"
        }
    }
]
```

#### `GET /posts/search`
Busca um post por uma palavra chave

**Request** 
```http
GET /posts/search?query=tecnologia
Content-Type: application/json
```
**Response**
```json
[
    {
        "id": 2,
        "title": "Tec Bob",
        "content": "Tecnologia",
        "published": false,
        "authorId": 1,
        "createdAt": "2024-07-28T22:03:01.742Z",
        "updatedAt": "2024-07-28T22:03:01.742Z"
    }
]
```


#### `POST /post`
Criação de postagem.

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

#### `PUT /post/:id`
Editar um post.

**Request:**

```http
PUT /post/:id
Content-Type: application/json
data: 
{
  "title": "Updated Post Title",
  "content": "This is the updated content of the post.",
  "published": true
}
```
**Response:**
```json
{
  "id": 2,
  "title": "Updated Post Title",
  "content": "This is the updated content of the post.",
  "published": true,
  "authorId": 7,
  "createdAt": "20204-07-28T19:46:16.841Z",
  "updatedAt": "20204-07-28T19:58:56.841Z"
}
```
#### `DEL/post/:id`
Deleta um post específico

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
  "title": "Deleted Post",
  "content": "This post has been deleted.",
  "published": false,
  "authorId": 1,
  "createdAt": "2024-07-28T12:00:00.000Z",
  "updatedAt": "2024-07-28T12:00:00.000Z"
}

```

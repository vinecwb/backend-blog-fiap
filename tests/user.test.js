// tests/user.test.js
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { app } from '../src/index'; 

dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

let post;

beforeEach(async () => {
  // Limpar as tabelas
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  
  // Inserir um usuário de teste
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  // Inserir um post de teste
  post = await prisma.post.create({
    data: {
      title: 'Test Post',
      content: 'Test content',
      published: true,
      author: { connect: { email: 'test@example.com' } },
    },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('API Endpoints', () => {
  test('GET /users should return a list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: expect.any(Number),
        email: 'test@example.com',
        name: 'Test User',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]);
  });

  // test('GET /posts should return a list of published posts with authors', async () => {
  //   const response = await request(app).get('/posts');
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(expect.arrayContaining([{
  //     id: expect.any(Number),
  //     title: 'Test Post',
  //     content: 'Test content',
  //     published: true,
  //     createdAt: expect.any(String),
  //     updatedAt: expect.any(String),
  //     author: {
  //       id: expect.any(Number),
  //       email: 'test@example.com',
  //       name: 'Test User',
  //       createdAt: expect.any(String),
  //       updatedAt: expect.any(String),
  //     },
  //   }]));
  // });
  


  test('GET /post/:id should return a post by id', async () => {
    const response = await request(app).get(`/post/${post.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      authorId: expect.any(Number),
    });
  });
  

  test('POST /user should create a new user', async () => {
    const response = await request(app).post('/user').send({
      email: 'newuser@example.com',
      name: 'New User',
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      email: 'newuser@example.com',
      name: 'New User',
    });
  });

  test('POST /post should create a new post', async () => {
    const response = await request(app).post('/post').send({
      title: 'New Post',
      content: 'New content',
      authorEmail: 'test@example.com',
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      title: 'New Post',
      content: 'New content',
      published: false,
      authorId: expect.any(Number),
    });
  });
  
  });

  test('PUT /post/publish/:id should publish a post', async () => {
    const response = await request(app).put(`/post/publish/${post.id}`);
    expect(response.status).toBe(200);
    expect(response.body.published).toBe(true);
  });

  test('PUT /post/:id should update a post', async () => {
    const response = await request(app).put(`/post/${post.id}`).send({
      title: 'Updated Title',
      content: 'Updated content',
      published: true,
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      title: 'Updated Title',
      content: 'Updated content',
      published: true,
    });
  });

  test('DELETE /post/:id should delete a post', async () => {
    const response = await request(app).delete(`/post/${post.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: post.id,
      title: post.title,
      content: post.content,
    });
  });

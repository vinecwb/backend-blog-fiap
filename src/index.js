import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/posts/admin', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });
  res.json(post);
});

app.get('/posts/search', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query string is required' });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/user', async (req, res) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  });
  res.json(result);
});

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  });
  res.json(result);
});

app.put('/post/publish/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });
  res.json(post);
});

app.put('/post/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the post' });
  }
});

app.delete('/post/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const deletedPost = await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the post' });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
 
export { app };

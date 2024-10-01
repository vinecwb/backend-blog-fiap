import { PrismaClient } from '@prisma/client';
import express from 'express';
import authRoutes from './routes/auth.js';
import cors from 'cors'

const prisma = new PrismaClient();
const app = express();

app.use(cors({
    origin: 'http://localhost:3002', 
    credentials: true
}));
app.use(express.json());
app.use('/auth', authRoutes);

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body;

  if (!title || !content || !authorEmail) {
    return res.status(400).json({ error: 'Title, content, and authorEmail are required' });
  }

  try {
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: false,
        author: { connect: { email: authorEmail } },
      },
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating post' });
  }
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
      data: { title, content, published: false },
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

    await prisma.comment.deleteMany({
      where: { postId: Number(id) },
    });

    const deletedPost = await prisma.post.delete({
      where: { id: Number(id) },
    });

    res.json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the post' });
  }
});

// Get comments for a specific post
app.get('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(id) },
      include: { author: true },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Post a new comment
app.post('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { content, authorId } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: Number(id),
        authorId: Number(authorId),
      },
    });
    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}


export { app };

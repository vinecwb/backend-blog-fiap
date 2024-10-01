import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  console.log('Recebendo requisição de registro:', req.body);
  const { email, password, name, role } = req.body; // Incluindo o campo role

  // Verificando se todos os campos necessários estão presentes
  if (!email || !password || !name || !role) { // Adicione role aqui
    return res.status(400).json({ error: 'Email, password, name, and role are required' });
  }

  try {
    // Hash a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar um novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role // Incluindo o campo role ao criar o usuário
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

export default router;

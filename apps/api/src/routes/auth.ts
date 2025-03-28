import bcrypt from 'bcrypt';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import prismaService from '../services/prisma.service';
import { AuthSignin, AuthRegister } from '@repo/shared/dist/interfaces/auth';
const router = express.Router();


declare module 'express-session' {
  interface SessionData {
    userId: string;
    user: {
      id: string, username: string
    };
    isAuthenticated: boolean;
  }
}


router.post('/login', async (req, res) => {
  const { username, password } = req.body as AuthSignin.Request;


  const user = await prismaService.prisma.user.findUnique({
    where: { name: username }
  });

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  req.session.user = {
    id: user.id,
    username: user.name
  };
  req.session.isAuthenticated = true;

  return res.json({
    isAuthenticated: true,
    id: user.id,
    username: user.name,
  } as AuthSignin.Response);
});


router.post('/signup', async (req, res) => {
  const { username, password } = req.body as AuthRegister.Request;

  const user = await prismaService.prisma.user.findUnique({
    where: { name: username }
  });

  if (user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prismaService.prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: username,
      passwordHash
    }
  });

  req.session.userId = newUser.id;
  req.session.user = {
    id: newUser.id,
    username: newUser.name
  };
  req.session.isAuthenticated = true;

  return res.json({
    isAuthenticated: true,
    id: newUser.id,
    username: newUser.name,
  } as AuthRegister.Response);
});


router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to logout' });
    }

    res.clearCookie('connect.sid');
    return res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  });
});


router.get('/me', (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.json({ isAuthenticated: false });
  }

  return res.json({
    isAuthenticated: true,
    user: {
      id: req.session.userId,
      username: req.session.user.username,
    }
  });
});

export default router; 

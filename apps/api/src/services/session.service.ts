import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import session from 'express-session';
import prismaService from './prisma.service';


const ONE_DAY = 1000 * 60 * 60 * 24;

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'auction-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: ONE_DAY
  },
  store: new PrismaSessionStore(
    prismaService.prisma,
    {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
}); 

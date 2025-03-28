import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.isAuthenticated) {
    throw new UnauthorizedError('Authentication required');
  }

  next();
};

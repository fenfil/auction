import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../errors';

export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    console.error('Prisma error:', err);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Database error',
    });
  }

  console.error('unknown error:', err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Something went wrong, please try again later',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorHandlerMiddleware; 

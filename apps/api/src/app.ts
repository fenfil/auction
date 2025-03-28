import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';

import errorHandlerMiddleware from './middleware/error-handler';
import authRoutes from './routes/auth';
import bidRoutes from './routes/bids';
import lotRoutes from './routes/lots';
import { sessionMiddleware } from './services/session.service';


import { createServer } from 'http';
import { socketService } from './services/socket.service';

const app = express();
const httpServer = createServer(app);

socketService.configure(httpServer);

app.use(helmet());

app.use(cors({
  origin: process.env.UI_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(sessionMiddleware);

app.use('/lots', lotRoutes);
app.use('/lots', bidRoutes);
app.use('/auth', authRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(errorHandlerMiddleware);

export default httpServer; 

import { GetLot } from '@repo/shared/dist/interfaces/lots';
import http from 'http';
import { Server } from "socket.io";

class SocketService {
  io: Server;

  configure(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.UI_URL,
        credentials: true,
      },
    });

    this.io.on('connection', socket => {
      console.log('User connected');

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  lotChanged(lot: GetLot.Response) {
    this.io.emit(`lot`, lot);
  }
}

export const socketService = new SocketService(); 

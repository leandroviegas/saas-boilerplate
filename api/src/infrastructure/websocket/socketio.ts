import logger from '@/infrastructure/logger/logger';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '@/infrastructure/cache/redis';
import { authService } from '@/application';
import { WsTo, WsData } from '@/application/shared/websockets.service';
import { wsEventEnum, wsTypeEnum } from '@/core/constants/websockets.enum';

export const socketio = (io: SocketIOServer) => {
  io.adapter(createAdapter(pubClient, subClient));

  subClient.subscribe(...Object.values(wsEventEnum));

  subClient.on('message', (channel: string, message: string) => {
    try {
      const { to, data }: { to: WsTo, data: WsData } = JSON.parse(message);

      if (to?.session) {
        io.to(`session-${to.session}`).emit(channel, data);
        if (data.type == wsTypeEnum.SESSION_REVOKED)
          io.sockets.sockets.forEach(socket => {
            socket.rooms.has(`session-${to.session}`) ? socket.disconnect(true) : null
          });
        return
      }

      if (to?.user) {
        io.to(`user-${to.user}`).emit(channel, data);
        return
      }

      io.sockets.sockets.forEach(socket => {
        socket.emit(channel, data);
      });
    } catch (err) {
      logger.error('Error handling pub/sub message', err);
    }
  });

  io.on('connection', async (socket) => {
    try {
      const headers = socket.handshake.headers;
      const sessionData = await authService.session(headers);

      if (!sessionData) {
        socket.disconnect(true);
        return;
      }

      const { user, session } = sessionData;

      socket.join(`user-${user.id}`);

      socket.join(`session-${session.id}`);

      socket.on('disconnect', () => { });
    } catch (error) {
      socket.disconnect(true);
    }
  });
}
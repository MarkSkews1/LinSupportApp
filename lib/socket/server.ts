import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

export interface SocketUser {
  userId: string;
  tenantId: string;
  role: string;
  socketId: string;
}

// Connected users map: socketId -> user info
const connectedUsers = new Map<string, SocketUser>();

// Tenant rooms map: tenantId -> Set of socketIds
const tenantRooms = new Map<string, Set<string>>();

export function initSocket(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3009',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
  });

  io.on('connection', (socket: Socket) => {
    console.log('Socket connected:', socket.id);

    // Handle user authentication
    socket.on('authenticate', (data: { userId: string; tenantId: string; role: string }) => {
      const { userId, tenantId, role } = data;

      // Store user info
      connectedUsers.set(socket.id, {
        userId,
        tenantId,
        role,
        socketId: socket.id,
      });

      // Join tenant room
      const tenantRoom = `tenant:${tenantId}`;
      socket.join(tenantRoom);

      // Track tenant room membership
      if (!tenantRooms.has(tenantId)) {
        tenantRooms.set(tenantId, new Set());
      }
      tenantRooms.get(tenantId)?.add(socket.id);

      // Join user-specific room
      socket.join(`user:${userId}`);

      // Notify others in tenant that user is online
      socket.to(tenantRoom).emit('user:online', { userId, role });

      console.log(`User ${userId} authenticated in tenant ${tenantId}`);
    });

    // Handle joining conversation rooms
    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Handle leaving conversation rooms
    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Handle typing indicator
    socket.on('typing:start', (data: { conversationId: string; userId: string; userName: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:start', {
        userId: data.userId,
        userName: data.userName,
      });
    });

    socket.on('typing:stop', (data: { conversationId: string; userId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:stop', {
        userId: data.userId,
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);

      if (user) {
        const { userId, tenantId, role } = user;
        const tenantRoom = `tenant:${tenantId}`;

        // Remove from tenant room tracking
        tenantRooms.get(tenantId)?.delete(socket.id);
        if (tenantRooms.get(tenantId)?.size === 0) {
          tenantRooms.delete(tenantId);
        }

        // Notify others that user is offline
        io?.to(tenantRoom).emit('user:offline', { userId, role });

        // Remove user from connected users
        connectedUsers.delete(socket.id);

        console.log(`User ${userId} disconnected from tenant ${tenantId}`);
      }

      console.log('Socket disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function getConnectedUsers(): Map<string, SocketUser> {
  return connectedUsers;
}

export function getUsersByTenant(tenantId: string): SocketUser[] {
  const socketIds = tenantRooms.get(tenantId) || new Set();
  return Array.from(socketIds)
    .map(socketId => connectedUsers.get(socketId))
    .filter((user): user is SocketUser => user !== undefined);
}

// Emit to specific conversation
export function emitToConversation(conversationId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(event, data);
  }
}

// Emit to specific user
export function emitToUser(userId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
}

// Emit to entire tenant
export function emitToTenant(tenantId: string, event: string, data: unknown): void {
  if (io) {
    io.to(`tenant:${tenantId}`).emit(event, data);
  }
}




import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { VISUALIZED } from 'src/decorators/visualized.enums';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
  ) {}

  private clients: Map<string, string> = new Map();

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.assert('Gateway WS Running');
  }

  public isProfileOnline(id: string) {
    return this.clients.has(id);
  }

  async handleConnection(client: Socket) {
    const validToken = this.auth.validToken(
      client.handshake.query.clientToken.toString(),
    );
    if (!validToken) {
      return client.disconnect();
    } else {
      const profile = await this.auth.checkToken(
        client.handshake.query.clientToken.toString(),
      );
      if (profile.id !== client.handshake.query.clientId.toString()) {
        return client.disconnect();
      }
      this.disconnect(profile.id); // Disconnect the client existent with the same ID
      this.clients.set(profile.id.toString(), client.id.toString());
      await this.handleOnlindeVisualized(profile.id);
    }
  }

  disconnect(id: string) {
    this.clients.delete(id);
  }

  async handleDisconnect(client: Socket) {
    this.clients.delete(client.handshake.query.clientId.toString());
  }

  @SubscribeMessage('typing')
  async handleTyping(client: Socket, payload: { to: string; typing: boolean }) {
    const clientTarget = this.clients.get(payload.to);
    const profileTarget = await this.prisma.existProfile(payload.to);
    const clientSender = this.clients.get(
      client.handshake.query.clientId.toString(),
    );
    if (profileTarget && clientTarget) {
      return this.server.to(clientTarget).emit('typing', {
        from: clientSender,
        typing: payload.typing,
      });
    }
  }

  async handleOnlindeVisualized(receiverId: string) {
    const profiles = await this.prisma.message.findMany({
      where: {
        receiverId,
        visualized: VISUALIZED.NOT_RECEIVED,
      },
      distinct: ['senderId'],
      select: {
        senderId: true,
      },
    });

    console.log('profiles on handleOnlineVisualized', profiles);

    await this.prisma.message.updateMany({
      where: {
        receiverId,
        visualized: VISUALIZED.NOT_RECEIVED,
      },
      data: {
        visualized: VISUALIZED.ONLINE,
      },
    });

    const targets = profiles.map((profile) => {
      return this.clients.get(profile.senderId);
    });

    console.log('targets on handleOnlineVisualized', targets);

    targets.forEach((target) => {
      if (target) {
        this.server.to(target).emit('visualized', {
          from: receiverId,
          visualized: VISUALIZED.ONLINE,
        });
      }
    });
  }

  @SubscribeMessage('visualized')
  async handleVisualized(
    client: Socket,
    payload: { to: string; visualized: VISUALIZED },
  ) {
    const clientTarget = this.clients.get(payload.to);
    const profileTarget = await this.prisma.existProfile(payload.to);
    const clientSender = client.handshake.query.clientId.toString();

    if (profileTarget) {
      await this.prisma.message.updateMany({
        where: {
          receiverId: clientSender,
          senderId: profileTarget.id,
          OR: [
            {
              visualized: VISUALIZED.NOT_RECEIVED,
            },
            {
              visualized: VISUALIZED.ONLINE,
            },
          ],
        },
        data: {
          visualized: VISUALIZED.VISUALIZED,
        },
      });
      if (clientTarget) {
        this.server.to(clientTarget).emit('visualized', {
          from: clientSender,
          visualized: payload.visualized,
        });
      }
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { to: string; message: string; sensible: boolean },
  ) {
    const clientTarget = this.clients.get(payload.to);
    const profileTarget = await this.prisma.existProfile(payload.to);
    const clientSender = client.handshake.query.clientId.toString();
    if (!payload.sensible) {
      payload.sensible = false;
    }
    if (profileTarget) {
      const message = await this.prisma.message.create({
        data: {
          message: payload.sensible
            ? this.prisma.encrypt(payload.message)
            : payload.message,
          sensible: payload.sensible,
          senderId: clientSender,
          receiverId: profileTarget.id,
          visualized: clientTarget
            ? VISUALIZED.ONLINE
            : VISUALIZED.NOT_RECEIVED,
        },
      });
      message.message = payload.message;
      if (clientTarget) {
        return this.server.to(clientTarget).emit('message', {
          ...message,
        });
      }
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ROLE } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.message.findMany();
  }

  receivedByUser(id: string) {
    return this.prisma.message.findMany({
      where: {
        receiverId: id,
      },
    });
  }

  sendedUser(id: string) {
    return this.prisma.message.findMany({
      where: {
        senderId: id,
      },
    });
  }

  async chat(
    sender: string,
    receiver: string,
    profile: { id: string; role: ROLE },
  ) {
    if (profile.id !== sender && profile.id !== receiver) {
      if (profile.role === ROLE.ADMIN) {
        const messages = await this.prisma.message.findMany({
          where: {
            OR: [
              {
                senderId: sender,
                receiverId: receiver,
              },
              {
                senderId: receiver,
                receiverId: sender,
              },
            ],
          },
          take: 50,
          orderBy: {
            createdAt: 'desc',
          },
        });
        return messages.reverse();
      } else {
        throw new UnauthorizedException(
          'Você não tem permissão para acessar essa conversa',
        );
      }
    }
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: sender,
            receiverId: receiver,
          },
          {
            senderId: receiver,
            receiverId: sender,
          },
        ],
      },
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // unrash messages with sensible boolean true
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].sensible) {
        messages[i].message = this.prisma.decrypt(messages[i].message);
        }
    }
    return messages.reverse();
  }

  async myChat(
    sender: string,
    profile: { id: string},
  ) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: sender,
            receiverId: profile.id,
          },
          {
            senderId: profile.id,
            receiverId: sender,
          },
        ],
      },
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // unrash messages with sensible boolean true
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].sensible) {
        messages[i].message = this.prisma.decrypt(messages[i].message);
        }
    }
    return messages.reverse();
  }

  findOne(id: string) {
    return this.prisma.message.findUnique({
      where: {
        id,
      },
    });
  }
}

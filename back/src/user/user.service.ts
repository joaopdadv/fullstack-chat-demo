import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE } from 'src/decorators';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly chat: ChatGateway) {}

  async findAll(profile: { id: string; role: ROLE }) {
    const users = await this.prisma.profile.findMany({
      where: {
        id: {
          not: profile.id,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        role: true,
        image: true,
        Sended: {
          where: {
            receiverId: profile.id,
          },
          select: {
            id: true,
            message: true,
            visualized: true,
            sensible: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        Received: {
          where: {
            senderId: profile.id,
          },
          select: {
            id: true,
            message: true,
            visualized: true,
            sensible: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    const contacts = users.map((user) => {
      const contact = {
        profile: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        lastMessage: '',
        userStatus: this.chat.isProfileOnline(user.id),
        visualized: 0,
      };

      if (user.Sended.length > 0 && user.Received.length === 0) {
        if (user.Sended[0].sensible) {
          contact.lastMessage = this.prisma.decrypt(user.Sended[0].message);
          contact.visualized = user.Sended[0].visualized;
        } else {
          contact.lastMessage = user.Sended[0].message;
          contact.visualized = user.Sended[0].visualized;
        }
      } else if (user.Sended.length === 0 && user.Received.length > 0) {
        if (user.Received[0].sensible) {
          contact.lastMessage = this.prisma.decrypt(user.Received[0].message);
          contact.visualized = user.Received[0].visualized;
        } else {
          contact.lastMessage = user.Received[0].message;
          contact.visualized = user.Received[0].visualized;
        }
      } else if (user.Sended.length > 0 && user.Received.length > 0) {
        if (user.Sended[0].createdAt > user.Received[0].createdAt) {
          if (user.Sended[0].sensible) {
            contact.lastMessage = this.prisma.decrypt(user.Sended[0].message);
            contact.visualized = user.Sended[0].visualized;
          } else {
            contact.lastMessage = user.Sended[0].message;
            contact.visualized = user.Sended[0].visualized;
          }
        } else {
          if (user.Received[0].sensible) {
            contact.lastMessage = this.prisma.decrypt(user.Received[0].message);
            contact.visualized = user.Received[0].visualized;
          } else {
            contact.lastMessage = user.Received[0].message;
            contact.visualized = user.Received[0].visualized;
          }
        }
      }else {
        contact.lastMessage = '';
      }
      return contact;
    });

    return contacts;
  }

  findOne(id: string) {
    return this.prisma.profile.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        role: true,
      },
    });
  }

  update(
    id: string,
    data: UpdateUserDto,
    profile: { id: string; role: ROLE; email: string },
  ) {
    if (id !== profile.id) {
      if (profile.role === ROLE.ADMIN) {
        return this.prisma.profile.update({
          where: {
            id,
          },
          data: {
            name: data.name,
            image: data.image,
          },
        });
      }
      throw new UnauthorizedException(
        "You don't have permission to update this user name",
      );
    }
    return this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        image: data.image,
      },
    });
  }
}

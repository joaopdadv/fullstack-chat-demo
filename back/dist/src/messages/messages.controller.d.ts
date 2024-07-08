import { MessagesService } from './messages.service';
import { ROLE } from 'src/decorators';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        message: string;
        sensible: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
        visualized: number;
    }[]>;
    receivedByUser(id: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        message: string;
        sensible: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
        visualized: number;
    }[]>;
    sendByUser(id: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        message: string;
        sensible: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
        visualized: number;
    }[]>;
    myChat(user: string, profile: {
        id: string;
    }): Promise<{
        id: string;
        message: string;
        sensible: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
        visualized: number;
    }[]>;
    chatUser(sender: string, receiver: string, profile: {
        id: string;
        role: ROLE;
    }): Promise<{
        id: string;
        message: string;
        sensible: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
        visualized: number;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__MessageClient<{
        id: string;
        message: string;
        sensible: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
        visualized: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
}

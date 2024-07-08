import { ROLE } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class MessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    sendedUser(id: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        message: string;
        sensible: boolean;
        createdAt: Date;
        senderId: string;
        receiverId: string;
        visualized: number;
    }[]>;
    chat(sender: string, receiver: string, profile: {
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
    myChat(sender: string, profile: {
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

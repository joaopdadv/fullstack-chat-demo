import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE } from 'src/decorators';
import { ChatGateway } from 'src/chat/chat.gateway';
export declare class UserService {
    private readonly prisma;
    private readonly chat;
    constructor(prisma: PrismaService, chat: ChatGateway);
    findAll(profile: {
        id: string;
        role: ROLE;
    }): Promise<{
        profile: {
            id: string;
            name: string;
            image: string;
        };
        lastMessage: string;
        userStatus: boolean;
        visualized: number;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ProfileClient<{
        id: string;
        name: string;
        email: string;
        role: number;
    }, null, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateUserDto, profile: {
        id: string;
        role: ROLE;
        email: string;
    }): import("@prisma/client").Prisma.Prisma__ProfileClient<{
        id: string;
        name: string;
        email: string;
        image: string;
        password: string;
        role: number;
        createdAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}

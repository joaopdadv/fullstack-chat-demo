import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ROLE } from 'src/decorators';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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

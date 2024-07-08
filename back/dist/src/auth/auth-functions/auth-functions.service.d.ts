import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from '../Validation';
export declare class AuthFunctionsService extends PrismaService {
    findLogin(login: LoginDto): Promise<{
        id: string;
        email: string;
        role: number;
        name: string;
    }>;
    register(register: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: number;
    }>;
    profileInfo(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: number;
    }>;
}

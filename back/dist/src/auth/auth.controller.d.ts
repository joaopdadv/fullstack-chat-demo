import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './Validation';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    login(login: LoginDto): Promise<{
        token: string;
        profile: {
            id: string;
            email: string;
            role: number;
            name: string;
        };
    }>;
    registerGym(register: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: number;
    }>;
}

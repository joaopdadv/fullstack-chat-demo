import { LoginDto } from './Validation/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './Validation';
import { AuthFunctionsService } from './auth-functions/auth-functions.service';
export declare class AuthService {
    private readonly authFunctions;
    private readonly jwt;
    private issuer;
    private audience;
    constructor(authFunctions: AuthFunctionsService, jwt: JwtService);
    login(login: LoginDto): Promise<{
        token: string;
        profile: {
            id: string;
            email: string;
            role: number;
            name: string;
        };
    }>;
    register(register: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: number;
    }>;
    createToken(profile: {
        id: string;
        email: string;
        role: number;
        name: string;
    }): Promise<{
        token: string;
        profile: {
            id: string;
            email: string;
            role: number;
            name: string;
        };
    }>;
    checkToken(token: string): Promise<any>;
    validToken(token: string): boolean;
}

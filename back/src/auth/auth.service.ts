import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './Validation/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './Validation';
import { AuthFunctionsService } from './auth-functions/auth-functions.service';

@Injectable()
export class AuthService {
  private issuer = 'workouts-auth-system';
  private audience = 'profile';

  constructor(
    private readonly authFunctions: AuthFunctionsService,
    private readonly jwt: JwtService,
  ) {}

  async login(login: LoginDto) {
    const user = await this.authFunctions.findLogin(login);
    return this.createToken(user);
  }

  async register(register: RegisterDto) {
    if (register.name.length === 0) {
      register.name = register.email.split('@')[0];
    }
    return this.authFunctions.register(register);
  }

  async createToken(profile: {
    id: string;
    email: string;
    role: number;
    name: string;
  }) {
    return {
      token: this.jwt.sign(
        {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          name: profile.name,
        },
        {
          expiresIn: '7 days',
          subject: profile.id,
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
      profile: profile,
    };
  }

  async checkToken(token: string) {
    try {
      const data = this.jwt.verify(token, {
        audience: this.audience,
        issuer: this.issuer,
      });
      return data;
    } catch (e) {
      throw new UnauthorizedException('O token não foi identificado');
    }
  }

  validToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}

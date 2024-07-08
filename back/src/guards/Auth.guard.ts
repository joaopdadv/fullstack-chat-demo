import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthFunctionsService } from 'src/auth/auth-functions/auth-functions.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly authFunctions: AuthFunctionsService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      const data = await this.authService.checkToken(
        (authorization ?? '').split(' ')[1],
      );

      request.token = data;

      const profile = await this.authFunctions.profileInfo(data.id);

      request.profile = profile;

      return true;
    } catch {
      console.log({
        AuthGuard:
          'src/guards/AuthGuard: Token não identificado.(token não valido)',
      });
      return false;
    }
  }
}

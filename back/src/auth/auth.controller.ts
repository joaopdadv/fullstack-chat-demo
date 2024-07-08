import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './Validation';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() login: LoginDto) {
    return this.service.login(login);
  }

  @Post('register')
  registerGym(@Body() register: RegisterDto) {
    return this.service.register(register);
  }

}

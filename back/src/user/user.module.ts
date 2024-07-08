import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [PrismaModule, AuthModule, ChatModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

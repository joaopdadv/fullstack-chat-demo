import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [PrismaModule, MessagesModule, AuthModule, UserModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

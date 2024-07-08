import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [ChatGateway],
    exports: [ChatGateway],
})
export class ChatModule {}

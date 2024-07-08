import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly prisma;
    private readonly auth;
    constructor(prisma: PrismaService, auth: AuthService);
    private clients;
    server: Server;
    afterInit(server: Server): void;
    isProfileOnline(id: string): boolean;
    handleConnection(client: Socket): Promise<Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
    disconnect(id: string): void;
    handleDisconnect(client: Socket): Promise<void>;
    handleTyping(client: Socket, payload: {
        to: string;
        typing: boolean;
    }): Promise<boolean>;
    handleOnlindeVisualized(receiverId: string): Promise<void>;
    handleVisualized(client: Socket, payload: {
        to: string;
    }): Promise<boolean>;
    handleMessage(client: Socket, payload: {
        to: string;
        message: string;
        sensible: boolean;
    }): Promise<boolean>;
}

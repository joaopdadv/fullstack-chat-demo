import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
    readonly algorithm = "aes-256-ctr";
    readonly secretKey = "TestKey1234567890";
    encrypt(data: string): string;
    decrypt(data: string): string;
    existProfile(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        image: string;
        password: string;
        role: number;
        createdAt: Date;
    }>;
    existProfileEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        image: string;
        password: string;
        role: number;
        createdAt: Date;
    }>;
}

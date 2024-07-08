import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { env } from 'process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  public readonly algorithm = 'aes-256-ctr';
  public readonly secretKey = "TestKey1234567890"; // Ensure the secretKey is properly assigned

  encrypt(data: string): string {
    const key = crypto.scryptSync(this.secretKey, 'salt', 32); // Derive key from this.secretKey
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(data: string): string {
    const [ivHex, encrypted] = data.split(':');
    const key = crypto.scryptSync(this.secretKey, 'salt', 32); // Derive key from this.secretKey
    const iv = Buffer.from(ivHex, 'hex'); // Convert the iv from hex string to Buffer
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async existProfile(id: string) {
    return this.profile.findUnique({
      where: {
        id,
      },
    });
  }

  async existProfileEmail(email: string) {
    return this.profile.findUnique({
      where: {
        email,
      },
    });
  }

}

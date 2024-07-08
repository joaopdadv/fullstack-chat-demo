"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("../decorators");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.message.findMany();
    }
    receivedByUser(id) {
        return this.prisma.message.findMany({
            where: {
                receiverId: id,
            },
        });
    }
    sendedUser(id) {
        return this.prisma.message.findMany({
            where: {
                senderId: id,
            },
        });
    }
    async chat(sender, receiver, profile) {
        if (profile.id !== sender && profile.id !== receiver) {
            if (profile.role === decorators_1.ROLE.ADMIN) {
                const messages = await this.prisma.message.findMany({
                    where: {
                        OR: [
                            {
                                senderId: sender,
                                receiverId: receiver,
                            },
                            {
                                senderId: receiver,
                                receiverId: sender,
                            },
                        ],
                    },
                    take: 50,
                    orderBy: {
                        createdAt: 'desc',
                    },
                });
                return messages.reverse();
            }
            else {
                throw new common_1.UnauthorizedException('Você não tem permissão para acessar essa conversa');
            }
        }
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: sender,
                        receiverId: receiver,
                    },
                    {
                        senderId: receiver,
                        receiverId: sender,
                    },
                ],
            },
            take: 50,
            orderBy: {
                createdAt: 'desc',
            },
        });
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].sensible) {
                messages[i].message = this.prisma.decrypt(messages[i].message);
            }
        }
        return messages.reverse();
    }
    async myChat(sender, profile) {
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: sender,
                        receiverId: profile.id,
                    },
                    {
                        senderId: profile.id,
                        receiverId: sender,
                    },
                ],
            },
            take: 50,
            orderBy: {
                createdAt: 'desc',
            },
        });
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].sensible) {
                messages[i].message = this.prisma.decrypt(messages[i].message);
            }
        }
        return messages.reverse();
    }
    findOne(id) {
        return this.prisma.message.findUnique({
            where: {
                id,
            },
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map
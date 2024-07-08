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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const decorators_1 = require("../decorators");
const chat_gateway_1 = require("../chat/chat.gateway");
let UserService = class UserService {
    constructor(prisma, chat) {
        this.prisma = prisma;
        this.chat = chat;
    }
    async findAll(profile) {
        const users = await this.prisma.profile.findMany({
            where: {
                id: {
                    not: profile.id,
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: false,
                role: true,
                image: true,
                Sended: {
                    where: {
                        receiverId: profile.id,
                    },
                    select: {
                        id: true,
                        message: true,
                        visualized: true,
                        sensible: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
                Received: {
                    where: {
                        senderId: profile.id,
                    },
                    select: {
                        id: true,
                        message: true,
                        visualized: true,
                        sensible: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });
        const contacts = users.map((user) => {
            const contact = {
                profile: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                },
                lastMessage: '',
                userStatus: this.chat.isProfileOnline(user.id),
                visualized: 0,
            };
            if (user.Sended.length > 0 && user.Received.length === 0) {
                if (user.Sended[0].sensible) {
                    contact.lastMessage = this.prisma.decrypt(user.Sended[0].message);
                    contact.visualized = user.Sended[0].visualized;
                }
                else {
                    contact.lastMessage = user.Sended[0].message;
                    contact.visualized = user.Sended[0].visualized;
                }
            }
            else if (user.Sended.length === 0 && user.Received.length > 0) {
                if (user.Received[0].sensible) {
                    contact.lastMessage = this.prisma.decrypt(user.Received[0].message);
                    contact.visualized = user.Received[0].visualized;
                }
                else {
                    contact.lastMessage = user.Received[0].message;
                    contact.visualized = user.Received[0].visualized;
                }
            }
            else if (user.Sended.length > 0 && user.Received.length > 0) {
                if (user.Sended[0].createdAt > user.Received[0].createdAt) {
                    if (user.Sended[0].sensible) {
                        contact.lastMessage = this.prisma.decrypt(user.Sended[0].message);
                        contact.visualized = user.Sended[0].visualized;
                    }
                    else {
                        contact.lastMessage = user.Sended[0].message;
                        contact.visualized = user.Sended[0].visualized;
                    }
                }
                else {
                    if (user.Received[0].sensible) {
                        contact.lastMessage = this.prisma.decrypt(user.Received[0].message);
                        contact.visualized = user.Received[0].visualized;
                    }
                    else {
                        contact.lastMessage = user.Received[0].message;
                        contact.visualized = user.Received[0].visualized;
                    }
                }
            }
            else {
                contact.lastMessage = '';
            }
            return contact;
        });
        return contacts;
    }
    findOne(id) {
        return this.prisma.profile.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: false,
                role: true,
            },
        });
    }
    update(id, data, profile) {
        if (id !== profile.id) {
            if (profile.role === decorators_1.ROLE.ADMIN) {
                return this.prisma.profile.update({
                    where: {
                        id,
                    },
                    data: {
                        name: data.name,
                        image: data.image,
                    },
                });
            }
            throw new common_1.UnauthorizedException("You don't have permission to update this user name");
        }
        return this.prisma.profile.update({
            where: {
                id,
            },
            data: {
                name: data.name,
                image: data.image,
            },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, chat_gateway_1.ChatGateway])
], UserService);
//# sourceMappingURL=user.service.js.map
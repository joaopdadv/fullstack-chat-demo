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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const auth_service_1 = require("../auth/auth.service");
const visualized_enums_1 = require("../decorators/visualized.enums");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatGateway = class ChatGateway {
    constructor(prisma, auth) {
        this.prisma = prisma;
        this.auth = auth;
        this.clients = new Map();
    }
    afterInit(server) {
        console.assert('Gateway WS Running');
    }
    isProfileOnline(id) {
        return this.clients.has(id);
    }
    async handleConnection(client) {
        const validToken = this.auth.validToken(client.handshake.query.clientToken.toString());
        if (!validToken) {
            return client.disconnect();
        }
        else {
            const profile = await this.auth.checkToken(client.handshake.query.clientToken.toString());
            if (profile.id !== client.handshake.query.clientId.toString()) {
                return client.disconnect();
            }
            this.disconnect(profile.id);
            this.clients.set(profile.id.toString(), client.id.toString());
            await this.handleOnlindeVisualized(profile.id);
        }
    }
    disconnect(id) {
        this.clients.delete(id);
    }
    async handleDisconnect(client) {
        this.clients.delete(client.handshake.query.clientId.toString());
    }
    async handleTyping(client, payload) {
        const clientTarget = this.clients.get(payload.to);
        const profileTarget = await this.prisma.existProfile(payload.to);
        const clientSender = this.clients.get(client.handshake.query.clientId.toString());
        if (profileTarget && clientTarget) {
            return this.server.to(clientTarget).emit('typing', {
                from: clientSender,
                typing: payload.typing,
            });
        }
    }
    async handleOnlindeVisualized(receiverId) {
        const profiles = await this.prisma.message.findMany({
            where: {
                receiverId,
                visualized: visualized_enums_1.VISUALIZED.NOT_RECEIVED,
            },
            distinct: ['senderId'],
            select: {
                senderId: true,
            },
        });
        console.log('profiles on handleOnlineVisualized', profiles);
        await this.prisma.message.updateMany({
            where: {
                receiverId,
                visualized: visualized_enums_1.VISUALIZED.NOT_RECEIVED,
            },
            data: {
                visualized: visualized_enums_1.VISUALIZED.ONLINE,
            },
        });
        const targets = profiles.map((profile) => {
            return this.clients.get(profile.senderId);
        });
        console.log('targets on handleOnlineVisualized', targets);
        targets.forEach((target) => {
            if (target) {
                this.server.to(target).emit('visualized', {
                    from: receiverId,
                    visualized: visualized_enums_1.VISUALIZED.ONLINE,
                });
            }
        });
    }
    async handleVisualized(client, payload) {
        const clientTarget = this.clients.get(payload.to);
        const profileTarget = await this.prisma.existProfile(payload.to);
        const clientSender = client.handshake.query.clientId.toString();
        if (profileTarget) {
            await this.prisma.message.updateMany({
                where: {
                    receiverId: clientSender,
                    senderId: profileTarget.id,
                    OR: [
                        {
                            visualized: visualized_enums_1.VISUALIZED.NOT_RECEIVED,
                        },
                        {
                            visualized: visualized_enums_1.VISUALIZED.ONLINE,
                        },
                    ],
                },
                data: {
                    visualized: visualized_enums_1.VISUALIZED.VISUALIZED,
                },
            });
            if (clientTarget) {
                return this.server.to(clientTarget).emit('visualized', {
                    from: clientSender,
                    visualized: visualized_enums_1.VISUALIZED.VISUALIZED,
                });
            }
        }
    }
    async handleMessage(client, payload) {
        const clientTarget = this.clients.get(payload.to);
        const profileTarget = await this.prisma.existProfile(payload.to);
        const clientSender = client.handshake.query.clientId.toString();
        if (!payload.sensible) {
            payload.sensible = false;
        }
        if (profileTarget) {
            const message = await this.prisma.message.create({
                data: {
                    message: payload.sensible
                        ? this.prisma.encrypt(payload.message)
                        : payload.message,
                    sensible: payload.sensible,
                    senderId: clientSender,
                    receiverId: profileTarget.id,
                    visualized: clientTarget
                        ? visualized_enums_1.VISUALIZED.ONLINE
                        : visualized_enums_1.VISUALIZED.NOT_RECEIVED,
                },
            });
            message.message = payload.message;
            if (clientTarget) {
                return this.server.to(clientTarget).emit('message', {
                    ...message,
                });
            }
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('visualized'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleVisualized", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map
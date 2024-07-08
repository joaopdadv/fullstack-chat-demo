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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const guards_1 = require("../guards");
const decorators_1 = require("../decorators");
const ProfileAtuh_decorator_1 = require("../decorators/ProfileAtuh.decorator");
let MessagesController = class MessagesController {
    constructor(messagesService) {
        this.messagesService = messagesService;
    }
    findAll() {
        return this.messagesService.findAll();
    }
    receivedByUser(id) {
        return this.messagesService.receivedByUser(id);
    }
    sendByUser(id) {
        return this.messagesService.sendedUser(id);
    }
    myChat(user, profile) {
        return this.messagesService.myChat(user, profile);
    }
    chatUser(sender, receiver, profile) {
        return this.messagesService.chat(sender, receiver, profile);
    }
    findOne(id) {
        return this.messagesService.findOne(id);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, decorators_1.Access)(decorators_1.ROLE.ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findAll", null);
__decorate([
    (0, decorators_1.Access)(decorators_1.ROLE.ADMIN),
    (0, common_1.Get)('received-by-user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "receivedByUser", null);
__decorate([
    (0, decorators_1.Access)(decorators_1.ROLE.ADMIN),
    (0, common_1.Get)('sended-by-user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "sendByUser", null);
__decorate([
    (0, decorators_1.Access)(),
    (0, common_1.Get)('my-chat/:user'),
    __param(0, (0, common_1.Param)('user')),
    __param(1, (0, ProfileAtuh_decorator_1.ProfileAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "myChat", null);
__decorate([
    (0, decorators_1.Access)(),
    (0, common_1.Get)('chat/:sender/:receiver'),
    __param(0, (0, common_1.Param)('sender')),
    __param(1, (0, common_1.Param)('receiver')),
    __param(2, (0, ProfileAtuh_decorator_1.ProfileAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "chatUser", null);
__decorate([
    (0, decorators_1.Access)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "findOne", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.RoleGuard),
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map
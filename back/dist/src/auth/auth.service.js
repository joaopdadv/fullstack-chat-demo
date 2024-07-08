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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_functions_service_1 = require("./auth-functions/auth-functions.service");
let AuthService = class AuthService {
    constructor(authFunctions, jwt) {
        this.authFunctions = authFunctions;
        this.jwt = jwt;
        this.issuer = 'workouts-auth-system';
        this.audience = 'profile';
    }
    async login(login) {
        const user = await this.authFunctions.findLogin(login);
        return this.createToken(user);
    }
    async register(register) {
        if (register.name.length === 0) {
            register.name = register.email.split('@')[0];
        }
        return this.authFunctions.register(register);
    }
    async createToken(profile) {
        return {
            token: this.jwt.sign({
                id: profile.id,
                email: profile.email,
                role: profile.role,
                name: profile.name,
            }, {
                expiresIn: '7 days',
                subject: profile.id,
                issuer: this.issuer,
                audience: this.audience,
            }),
            profile: profile,
        };
    }
    async checkToken(token) {
        try {
            const data = this.jwt.verify(token, {
                audience: this.audience,
                issuer: this.issuer,
            });
            return data;
        }
        catch (e) {
            throw new common_1.UnauthorizedException('O token não foi identificado');
        }
    }
    validToken(token) {
        try {
            this.checkToken(token);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_functions_service_1.AuthFunctionsService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
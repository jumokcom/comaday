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
var AuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../users/users.service");
const login_dto_1 = require("../users/dto/login.dto");
let AuthController = AuthController_1 = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
        this.logger = new common_1.Logger(AuthController_1.name);
    }
    async login(loginDto, session) {
        this.logger.debug(`Login attempt for user: ${loginDto.username}`);
        try {
            const user = await this.authService.validateUser(loginDto.username, loginDto.password);
            this.logger.debug(`User validated successfully: ${loginDto.username}, isAdmin: ${user.isAdmin}`);
            session.user = {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
            };
            await this.usersService.updateLastLogin(user.id);
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    isAdmin: user.isAdmin,
                },
            };
        }
        catch (error) {
            this.logger.error(`Login failed for user ${loginDto.username}: ${error.message}`);
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    async logout(session) {
        session.destroy();
        return { success: true };
    }
    async register(username, password, email) {
        this.logger.debug(`Registration attempt for user: ${username}`);
        try {
            const user = await this.usersService.create(username, password, email);
            this.logger.debug(`User registered successfully: ${username}`);
            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    isAdmin: user.isAdmin,
                },
            };
        }
        catch (error) {
            this.logger.error(`Registration failed for user ${username}: ${error.message}`);
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)('username')),
    __param(1, (0, common_1.Body)('password')),
    __param(2, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = AuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
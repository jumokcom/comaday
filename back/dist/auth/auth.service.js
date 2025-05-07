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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async validateUser(username, password) {
        this.logger.debug(`Attempting to validate user: ${username}`);
        const user = await this.usersService.findOne(username);
        this.logger.debug(`User found: ${user ? 'yes' : 'no'}`);
        if (!user) {
            this.logger.debug(`User not found: ${username}`);
            throw new common_1.UnauthorizedException('사용자를 찾을 수 없습니다.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        this.logger.debug(`Password validation result: ${isPasswordValid}`);
        if (!isPasswordValid) {
            this.logger.debug(`Invalid password for user: ${username}`);
            throw new common_1.UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        if (user.isGuest) {
            this.logger.debug(`Guest user attempted login: ${username}`);
            throw new common_1.UnauthorizedException('게스트 계정으로는 로그인할 수 없습니다.');
        }
        const { password: _ } = user, result = __rest(user, ["password"]);
        this.logger.debug(`User validated successfully: ${username}, isAdmin: ${result.isAdmin}`);
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
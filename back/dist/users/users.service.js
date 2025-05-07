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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async create(username, password, email) {
        const existingUser = await this.findOne(username);
        if (existingUser) {
            throw new common_1.ConflictException('이미 존재하는 사용자명입니다.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            username,
            password: hashedPassword,
            email,
            isGuest: false,
        });
        return this.userRepository.save(user);
    }
    async createGuest() {
        const user = this.userRepository.create({
            username: `guest_${Date.now()}`,
            password: await bcrypt.hash(Math.random().toString(), 10),
            isGuest: true,
        });
        return this.userRepository.save(user);
    }
    async findOne(username) {
        this.logger.debug(`Finding user by username: ${username}`);
        try {
            const allUsers = await this.userRepository.find();
            this.logger.debug('All users in database:');
            allUsers.forEach(user => {
                this.logger.debug(`Username: ${user.username}, isAdmin: ${user.isAdmin}`);
            });
            const user = await this.userRepository.findOne({
                where: { username },
                select: ['id', 'username', 'password', 'email', 'isAdmin', 'isGuest', 'coinCount', 'createdAt', 'updatedAt', 'lastLoginAt']
            });
            this.logger.debug(`User found: ${user ? 'yes' : 'no'}, isAdmin: ${user === null || user === void 0 ? void 0 : user.isAdmin}`);
            if (user) {
                this.logger.debug(`Found user details - id: ${user.id}, username: ${user.username}, isAdmin: ${user.isAdmin}`);
            }
            return user;
        }
        catch (error) {
            this.logger.error(`Error finding user: ${error.message}`);
            throw error;
        }
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
        }
        return user;
    }
    async updateLastLogin(id) {
        await this.userRepository.update(id, { lastLoginAt: new Date() });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map
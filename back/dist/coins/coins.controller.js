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
exports.CoinsController = void 0;
const common_1 = require("@nestjs/common");
const coins_service_1 = require("./coins.service");
let CoinsController = class CoinsController {
    constructor(coinsService) {
        this.coinsService = coinsService;
    }
    checkSession(session) {
        if (!session.user) {
            throw new common_1.UnauthorizedException('로그인이 필요합니다.');
        }
        return session.user;
    }
    async transfer(senderId, receiverId, amount) {
        return this.coinsService.transfer(senderId, receiverId, amount);
    }
    async getTransactions(userId) {
        return this.coinsService.getTransactions(+userId);
    }
    async getCoins(session) {
        const user = this.checkSession(session);
        return this.coinsService.getCoins(user.id);
    }
    async collectCoins(session) {
        const user = this.checkSession(session);
        return this.coinsService.collectCoins(user.id);
    }
    async earnCoins(req, amount, description) {
        return this.coinsService.earnCoins(req.user.id, amount, description);
    }
};
exports.CoinsController = CoinsController;
__decorate([
    (0, common_1.Post)('transfer'),
    __param(0, (0, common_1.Body)('senderId')),
    __param(1, (0, common_1.Body)('receiverId')),
    __param(2, (0, common_1.Body)('amount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "transfer", null);
__decorate([
    (0, common_1.Get)('history/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "getCoins", null);
__decorate([
    (0, common_1.Post)('collect'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "collectCoins", null);
__decorate([
    (0, common_1.Post)('earn'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], CoinsController.prototype, "earnCoins", null);
exports.CoinsController = CoinsController = __decorate([
    (0, common_1.Controller)('coins'),
    __metadata("design:paramtypes", [coins_service_1.CoinsService])
], CoinsController);
//# sourceMappingURL=coins.controller.js.map
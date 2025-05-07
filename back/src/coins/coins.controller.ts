import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Post('transfer')
  async transfer(
    @Body('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
    @Body('amount') amount: number,
  ): Promise<User> {
    return this.coinsService.transfer(senderId, receiverId, amount);
  }

  @Get('user/:userId')
  async getUserInfo(@Param('userId') userId: string): Promise<User> {
    return this.coinsService.getUserInfo(+userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('earn')
  async earnCoins(
    @Request() req,
    @Body('amount') amount: number,
  ): Promise<User> {
    return this.coinsService.earnCoins(req.user.id, amount);
  }
} 
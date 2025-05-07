import { Controller, Post, Body, Get, Param, UseGuards, Request, Session, UnauthorizedException } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinTransaction } from './entities/coin-transaction.entity';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  private checkSession(session: any) {
    if (!session.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return session.user;
  }

  @Post('transfer')
  async transfer(
    @Body('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
    @Body('amount') amount: number,
  ): Promise<CoinTransaction> {
    return this.coinsService.transfer(senderId, receiverId, amount);
  }

  @Get('history/:userId')
  async getTransactions(@Param('userId') userId: string): Promise<CoinTransaction[]> {
    return this.coinsService.getTransactions(+userId);
  }

  @Get()
  async getCoins(@Session() session: any) {
    const user = this.checkSession(session);
    return this.coinsService.getCoins(user.id);
  }

  @Post('collect')
  async collectCoins(@Session() session: any) {
    const user = this.checkSession(session);
    return this.coinsService.collectCoins(user.id);
  }

  @Post('earn')
  async earnCoins(
    @Request() req,
    @Body('amount') amount: number,
    @Body('description') description: string,
  ): Promise<CoinTransaction> {
    return this.coinsService.earnCoins(req.user.id, amount, description);
  }
} 
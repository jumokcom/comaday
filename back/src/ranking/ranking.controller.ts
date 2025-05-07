import { Controller, Get, Param } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { User } from '../users/entities/user.entity';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  async getRankings(): Promise<User[]> {
    return this.rankingService.getRankings();
  }

  @Get('user/:userId')
  async getUserRanking(@Param('userId') userId: string): Promise<{ rank: number; user: User }> {
    return this.rankingService.getUserRanking(+userId);
  }
} 
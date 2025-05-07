import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ranking } from './entities/ranking.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ranking)
    private rankingRepository: Repository<Ranking>,
  ) {}

  async createRanking(user: User, score: number): Promise<Ranking> {
    const ranking = this.rankingRepository.create({
      userId: user.id,
      username: user.username,
      score: score,
    });
    return this.rankingRepository.save(ranking);
  }

  async getRankings(): Promise<Ranking[]> {
    return this.rankingRepository.find({
      order: { score: 'DESC' },
      take: 10,
    });
  }

  async getUserRanking(userId: number): Promise<Ranking> {
    const rankings = await this.getRankings();
    return rankings.find(ranking => ranking.userId === userId);
  }
} 
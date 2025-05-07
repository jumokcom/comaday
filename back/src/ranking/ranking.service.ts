import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getRankings(): Promise<User[]> {
    return this.userRepository.find({
      order: {
        coinCount: 'DESC'
      },
      select: ['id', 'username', 'coinCount', 'memberNumber']
    });
  }

  async getUserRanking(userId: number): Promise<{ rank: number; user: User }> {
    const users = await this.getRankings();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return {
      rank: userIndex + 1,
      user: users[userIndex]
    };
  }
} 
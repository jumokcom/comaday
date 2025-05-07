import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RankingService {
  private rankingsCache: User[] | null = null;
  private lastUpdateTime: number = 0;
  private readonly CACHE_DURATION = 30000; // 30초

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getRankings(): Promise<User[]> {
    const now = Date.now();
    
    // 캐시가 있고 30초가 지나지 않았다면 캐시된 데이터 반환
    if (this.rankingsCache && (now - this.lastUpdateTime) < this.CACHE_DURATION) {
      return this.rankingsCache;
    }

    // 캐시가 없거나 만료되었다면 새로운 데이터 조회
    const rankings = await this.userRepository.find({
      order: {
        coinCount: 'DESC'
      },
      select: ['id', 'username', 'coinCount', 'isAdmin']
    });

    // 캐시 업데이트
    this.rankingsCache = rankings;
    this.lastUpdateTime = now;

    return rankings;
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

  // 캐시 무효화 메서드
  invalidateCache(): void {
    this.rankingsCache = null;
    this.lastUpdateTime = 0;
  }
} 
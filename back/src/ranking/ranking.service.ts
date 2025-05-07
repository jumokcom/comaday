import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

interface RankedUser extends User {
  rank: number;
}

@Injectable()
export class RankingService {
  private rankingsCache: RankedUser[] | null = null;
  private lastUpdateTime: number = 0;
  private readonly CACHE_DURATION = 30000; // 30초

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getRankings(): Promise<RankedUser[]> {
    const now = Date.now();
    
    // 캐시가 있고 30초가 지나지 않았다면 캐시된 데이터 반환
    if (this.rankingsCache && (now - this.lastUpdateTime) < this.CACHE_DURATION) {
      return this.rankingsCache;
    }

    // 캐시가 없거나 만료되었다면 새로운 데이터 조회
    const users = await this.userRepository.find({
      order: {
        coinCount: 'DESC'
      },
      select: ['id', 'username', 'coinCount', 'isAdmin']
    });

    // 공동 순위 계산
    let currentRank = 1;
    let currentCoins = users[0]?.coinCount;
    let skipCount = 0;

    const rankedUsers = users.map((user, index) => {
      if (user.coinCount !== currentCoins) {
        currentRank = index + 1;
        currentCoins = user.coinCount;
        skipCount = 0;
      } else {
        skipCount++;
      }

      return {
        ...user,
        rank: currentRank
      } as RankedUser;
    });

    // 캐시 업데이트
    this.rankingsCache = rankedUsers;
    this.lastUpdateTime = now;

    return rankedUsers;
  }

  async getUserRanking(userId: number): Promise<{ rank: number; user: User }> {
    const users = await this.getRankings();
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return {
      rank: user.rank,
      user
    };
  }

  // 캐시 무효화 메서드
  invalidateCache(): void {
    this.rankingsCache = null;
    this.lastUpdateTime = 0;
  }
} 
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RankingService } from '../ranking/ranking.service';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rankingService: RankingService,
  ) {}

  async transfer(senderId: number, receiverId: number, amount: number): Promise<User> {
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    if (sender.coinCount < amount) {
      throw new BadRequestException('보유한 코인이 부족합니다.');
    }

    // 트랜잭션 시작
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 코인 전송
      sender.coinCount -= amount;
      receiver.coinCount += amount;

      await queryRunner.manager.save(sender);
      await queryRunner.manager.save(receiver);

      await queryRunner.commitTransaction();
      
      // 랭킹 캐시 무효화
      this.rankingService.invalidateCache();
      
      return sender;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserInfo(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'username', 'coinCount', 'isAdmin']
    });
    
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async earnCoins(userId: number, amount: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('사용자를 찾을 수 없습니다.');
    }

    user.coinCount += amount;
    const savedUser = await this.userRepository.save(user);
    
    // 랭킹 캐시 무효화
    this.rankingService.invalidateCache();
    
    return savedUser;
  }
} 
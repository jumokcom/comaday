import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ranking } from '../ranking/entities/ranking.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Ranking)
    private rankingRepository: Repository<Ranking>,
  ) {}

  async approveNewUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.coinCount += 100;
    return this.userRepository.save(user);
  }

  async rejectNewUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.remove(user);
  }

  async sendCoinsToUser(userId: number, amount: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (amount <= 0) {
      throw new BadRequestException('코인 수량은 0보다 커야 합니다.');
    }

    user.coinCount += amount;
    return this.userRepository.save(user);
  }

  async getNewUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { isGuest: true },
      order: { createdAt: 'DESC' }
    });
  }

  async grantAdmin(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.isAdmin = true;
    return this.userRepository.save(user);
  }

  async revokeAdmin(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.isAdmin = false;
    return this.userRepository.save(user);
  }

  async getUsers() {
    return this.userRepository.find();
  }

  async getRankings() {
    return this.rankingRepository.find({
      order: { score: 'DESC' },
    });
  }
} 
import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(username: string, password: string, email?: string): Promise<User> {
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new ConflictException('이미 존재하는 사용자명입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      isGuest: false,
    });

    return this.userRepository.save(user);
  }

  async createGuest(): Promise<User> {
    const user = this.userRepository.create({
      username: `guest_${Date.now()}`,
      password: await bcrypt.hash(Math.random().toString(), 10),
      isGuest: true,
    });

    return this.userRepository.save(user);
  }

  async findOne(username: string): Promise<User | undefined> {
    this.logger.debug(`Finding user by username: ${username}`);
    
    try {
      // 모든 사용자를 가져와서 로깅
      const allUsers = await this.userRepository.find();
      this.logger.debug('All users in database:');
      allUsers.forEach(user => {
        this.logger.debug(`Username: ${user.username}, isAdmin: ${user.isAdmin}`);
      });

      // 정확한 매칭을 위해 쿼리 수정
      const user = await this.userRepository.findOne({
        where: { username },
        select: ['id', 'username', 'password', 'email', 'isAdmin', 'isGuest', 'coinCount', 'createdAt', 'updatedAt', 'lastLoginAt']
      });

      this.logger.debug(`User found: ${user ? 'yes' : 'no'}, isAdmin: ${user?.isAdmin}`);
      if (user) {
        this.logger.debug(`Found user details - id: ${user.id}, username: ${user.username}, isAdmin: ${user.isAdmin}`);
      }
      
      return user;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw error;
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }
} 
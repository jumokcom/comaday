import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    this.logger.debug(`Attempting to validate user: ${username}`);
    
    const user = await this.usersService.findOne(username);
    this.logger.debug(`User found: ${user ? 'yes' : 'no'}`);
    
    if (!user) {
      this.logger.debug(`User not found: ${username}`);
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    this.logger.debug(`Password validation result: ${isPasswordValid}`);

    if (!isPasswordValid) {
      this.logger.debug(`Invalid password for user: ${username}`);
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    if (user.isGuest) {
      this.logger.debug(`Guest user attempted login: ${username}`);
      throw new UnauthorizedException('게스트 계정으로는 로그인할 수 없습니다.');
    }

    const { password: _, ...result } = user;
    this.logger.debug(`User validated successfully: ${username}, isAdmin: ${result.isAdmin}`);
    return result;
  }
} 
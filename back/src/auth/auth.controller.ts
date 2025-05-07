import { Controller, Post, Body, UnauthorizedException, Logger, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: any,
  ) {
    this.logger.debug(`Login attempt for user: ${loginDto.username}`);
    
    try {
      const user = await this.authService.validateUser(loginDto.username, loginDto.password);
      this.logger.debug(`User validated successfully: ${loginDto.username}, isAdmin: ${user.isAdmin}`);
      
      // 세션에 사용자 정보 저장
      session.user = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
      };
      
      // 마지막 로그인 시간 업데이트
      await this.usersService.updateLastLogin(user.id);
      
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed for user ${loginDto.username}: ${error.message}`);
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('logout')
  async logout(@Session() session: any) {
    session.destroy();
    return { success: true };
  }

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email?: string,
  ) {
    this.logger.debug(`Registration attempt for user: ${username}`);
    
    try {
      const user = await this.usersService.create(username, password, email);
      this.logger.debug(`User registered successfully: ${username}`);
      
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      };
    } catch (error) {
      this.logger.error(`Registration failed for user ${username}: ${error.message}`);
      throw error;
    }
  }
} 
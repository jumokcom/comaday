import { Controller, Get, Post, Body, Param, Session, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private checkSession(session: any) {
    if (!session.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return session.user;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(
        createUserDto.username,
        createUserDto.password,
        createUserDto.email
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('회원가입 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('guest')
  async createGuest() {
    return this.usersService.createGuest();
  }

  @Get('profile')
  async getProfile(@Session() session: any) {
    const user = this.checkSession(session);
    return this.usersService.findById(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Session() session: any) {
    this.checkSession(session);
    return this.usersService.findById(+id);
  }
} 
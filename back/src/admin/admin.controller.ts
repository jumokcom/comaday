import { Controller, Get, Post, Body, Param, UseGuards, Session, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  private checkAdminSession(session: any) {
    if (!session.user || !session.user.isAdmin) {
      throw new UnauthorizedException('관리자 권한이 필요합니다.');
    }
  }

  @Get('users')
  async getUsers(@Session() session: any) {
    this.checkAdminSession(session);
    return this.adminService.getUsers();
  }

  @Get('rankings')
  async getRankings(@Session() session: any) {
    this.checkAdminSession(session);
    return this.adminService.getRankings();
  }

  @Get('new-users')
  async getNewUsers() {
    return this.adminService.getNewUsers();
  }

  @Post('users/:id/approve')
  async approveNewUser(@Param('id') id: string) {
    return this.adminService.approveNewUser(+id);
  }

  @Post('users/:id/reject')
  async rejectNewUser(@Param('id') id: string) {
    return this.adminService.rejectNewUser(+id);
  }

  @Post('users/:id/send-coins')
  async sendCoinsToUser(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ) {
    return this.adminService.sendCoinsToUser(+id, amount);
  }

  @Post('users/:id/grant-admin')
  async grantAdmin(@Param('id') id: string) {
    return this.adminService.grantAdmin(+id);
  }

  @Post('users/:id/revoke-admin')
  async revokeAdmin(@Param('id') id: string) {
    return this.adminService.revokeAdmin(+id);
  }
} 
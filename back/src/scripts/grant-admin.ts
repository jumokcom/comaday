import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminService } from '../admin/admin.service';

async function grantAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const adminService = app.get(AdminService);

  const userId = process.argv[2]; // 명령줄에서 사용자 ID를 받음
  if (!userId) {
    console.error('사용자 ID를 입력해주세요.');
    process.exit(1);
  }

  try {
    const user = await adminService.grantAdmin(Number(userId));
    console.log(`사용자 ${user.username}에게 관리자 권한이 부여되었습니다.`);
  } catch (error) {
    console.error('관리자 권한 부여 실패:', error.message);
  }

  await app.close();
}

grantAdmin(); 
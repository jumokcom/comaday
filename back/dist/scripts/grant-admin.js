"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const admin_service_1 = require("../admin/admin.service");
async function grantAdmin() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const adminService = app.get(admin_service_1.AdminService);
    const userId = process.argv[2];
    if (!userId) {
        console.error('사용자 ID를 입력해주세요.');
        process.exit(1);
    }
    try {
        const user = await adminService.grantAdmin(Number(userId));
        console.log(`사용자 ${user.username}에게 관리자 권한이 부여되었습니다.`);
    }
    catch (error) {
        console.error('관리자 권한 부여 실패:', error.message);
    }
    await app.close();
}
grantAdmin();
//# sourceMappingURL=grant-admin.js.map
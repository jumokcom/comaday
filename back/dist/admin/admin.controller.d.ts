import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    private checkAdminSession;
    getUsers(session: any): Promise<import("../users/entities/user.entity").User[]>;
    getRankings(session: any): Promise<import("../ranking/entities/ranking.entity").Ranking[]>;
    getNewUsers(): Promise<import("../users/entities/user.entity").User[]>;
    approveNewUser(id: string): Promise<import("../users/entities/user.entity").User>;
    rejectNewUser(id: string): Promise<void>;
    sendCoinsToUser(id: string, amount: number): Promise<import("../users/entities/user.entity").User>;
    grantAdmin(id: string): Promise<import("../users/entities/user.entity").User>;
    revokeAdmin(id: string): Promise<import("../users/entities/user.entity").User>;
}

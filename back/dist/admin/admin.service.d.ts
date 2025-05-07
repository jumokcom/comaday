import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ranking } from '../ranking/entities/ranking.entity';
export declare class AdminService {
    private userRepository;
    private rankingRepository;
    constructor(userRepository: Repository<User>, rankingRepository: Repository<Ranking>);
    approveNewUser(userId: number): Promise<User>;
    rejectNewUser(userId: number): Promise<void>;
    sendCoinsToUser(userId: number, amount: number): Promise<User>;
    getNewUsers(): Promise<User[]>;
    grantAdmin(userId: number): Promise<User>;
    revokeAdmin(userId: number): Promise<User>;
    getUsers(): Promise<User[]>;
    getRankings(): Promise<Ranking[]>;
}

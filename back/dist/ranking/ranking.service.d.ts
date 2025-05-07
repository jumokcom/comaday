import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ranking } from './entities/ranking.entity';
export declare class RankingService {
    private userRepository;
    private rankingRepository;
    constructor(userRepository: Repository<User>, rankingRepository: Repository<Ranking>);
    createRanking(user: User, score: number): Promise<Ranking>;
    getRankings(): Promise<Ranking[]>;
    getUserRanking(userId: number): Promise<Ranking>;
}

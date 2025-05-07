import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private userRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>);
    create(username: string, password: string, email?: string): Promise<User>;
    createGuest(): Promise<User>;
    findOne(username: string): Promise<User | undefined>;
    findById(id: number): Promise<User>;
    updateLastLogin(id: number): Promise<void>;
}

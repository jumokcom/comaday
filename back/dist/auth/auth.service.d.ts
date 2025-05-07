import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    validateUser(username: string, password: string): Promise<any>;
}

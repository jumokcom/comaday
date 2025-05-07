import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
export declare class AuthController {
    private authService;
    private usersService;
    private readonly logger;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto, session: any): Promise<{
        success: boolean;
        user: {
            id: any;
            username: any;
            isAdmin: any;
        };
    }>;
    logout(session: any): Promise<{
        success: boolean;
    }>;
    register(username: string, password: string, email?: string): Promise<{
        success: boolean;
        user: {
            id: number;
            username: string;
            isAdmin: boolean;
        };
    }>;
}

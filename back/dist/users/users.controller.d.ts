import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    private checkSession;
    register(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    createGuest(): Promise<import("./entities/user.entity").User>;
    getProfile(session: any): Promise<import("./entities/user.entity").User>;
    findOne(id: string, session: any): Promise<import("./entities/user.entity").User>;
}

import { UsersService } from './users.service';
import { UserMode } from '@prisma/client';
declare class UpdateUserModeDto {
    userMode: UserMode;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: any): Promise<any>;
    updateUserMode(user: any, dto: UpdateUserModeDto): Promise<{
        id: string;
        email: string;
        googleId: string;
        firstName: string | null;
        lastName: string | null;
        photoUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        userMode: import(".prisma/client").$Enums.UserMode | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};

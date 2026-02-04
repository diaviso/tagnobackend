import { PrismaService } from '../../common/prisma/prisma.service';
import { UserMode } from '@prisma/client';
interface CreateUserDto {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
}
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateUserDto): Promise<{
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
    findById(id: string): Promise<{
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
    } | null>;
    findByEmail(email: string): Promise<{
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
    } | null>;
    findByGoogleId(googleId: string): Promise<{
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
    } | null>;
    updateGoogleId(id: string, googleId: string): Promise<{
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
    updateUserMode(id: string, userMode: UserMode): Promise<{
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
    findAll(): Promise<{
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
    }[]>;
}
export {};

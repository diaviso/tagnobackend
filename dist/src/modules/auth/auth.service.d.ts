import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export interface GoogleProfile {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateGoogleUser(profile: GoogleProfile): Promise<{
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
    generateToken(user: {
        id: string;
        email: string;
        role: string;
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    validateJwtPayload(payload: JwtPayload): Promise<{
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
}

import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: GoogleProfile) {
    let user = await this.usersService.findByGoogleId(profile.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(profile.email);

      if (user) {
        user = await this.usersService.updateGoogleId(user.id, profile.googleId);
      } else {
        user = await this.usersService.create({
          googleId: profile.googleId,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          photoUrl: profile.photoUrl,
        });
      }
    }

    return user;
  }

  async generateToken(user: { id: string; email: string; role: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateJwtPayload(payload: JwtPayload) {
    return this.usersService.findById(payload.sub);
  }
}

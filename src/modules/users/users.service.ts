import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UserMode } from '@prisma/client';

interface CreateUserDto {
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        photoUrl: data.photoUrl,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async updateGoogleId(id: string, googleId: string) {
    return this.prisma.user.update({
      where: { id },
      data: { googleId },
    });
  }

  async updateUserMode(id: string, userMode: UserMode) {
    return this.prisma.user.update({
      where: { id },
      data: { userMode },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

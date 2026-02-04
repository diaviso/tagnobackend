import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UserMode } from '@prisma/client';

class UpdateUserModeDto {
  @ApiProperty({ enum: UserMode, description: 'Mode utilisateur' })
  @IsEnum(UserMode)
  userMode: UserMode;
}

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  async getMe(@CurrentUser() user: any) {
    return user;
  }

  @Patch('me/mode')
  @ApiOperation({ summary: 'Mettre à jour le mode utilisateur' })
  async updateUserMode(
    @CurrentUser() user: any,
    @Body() dto: UpdateUserModeDto,
  ) {
    return this.usersService.updateUserMode(user.id, dto.userMode);
  }
}

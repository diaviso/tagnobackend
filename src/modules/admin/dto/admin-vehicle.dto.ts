import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum VehicleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class AdminVehicleQueryDto {
  @ApiProperty({ enum: VehicleStatus, required: false })
  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;
}

export class RejectVehicleDto {
  @ApiProperty({ example: 'Documents incomplets', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class AdminUserQueryDto {
  @ApiProperty({ required: false, description: 'Recherche par email, nom ou prénom' })
  @IsString()
  @IsOptional()
  search?: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @IsEnum(UserRole)
  role: 'USER' | 'ADMIN';
}

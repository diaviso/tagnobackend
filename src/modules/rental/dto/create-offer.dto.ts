import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({ example: 'uuid-of-vehicle' })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(1)
  pricePerDay: number;

  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(0)
  depositAmount: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  minDays?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

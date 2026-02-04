import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateOfferDto {
  @ApiProperty({ example: 50, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  pricePerDay?: number;

  @ApiProperty({ example: 500, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  depositAmount?: number;

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

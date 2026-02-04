import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class SearchOfferDto {
  @ApiProperty({ example: 'Paris', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '2024-12-25', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2024-12-30', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

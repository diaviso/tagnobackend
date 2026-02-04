import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';

export class SearchTripDto {
  @ApiProperty({ example: 'Paris', required: false })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty({ example: 'Lyon', required: false })
  @IsString()
  @IsOptional()
  to?: string;

  @ApiProperty({ example: '2024-12-25', required: false })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  seats?: number;
}

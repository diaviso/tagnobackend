import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateTripDto {
  @ApiPropertyOptional({ example: 'Paris' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  departureCity?: string;

  @ApiPropertyOptional({ example: 'Lyon' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  arrivalCity?: string;

  @ApiPropertyOptional({ example: '2024-12-25T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  departureTime?: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Min(1)
  pricePerSeat?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  availableSeats?: number;
}

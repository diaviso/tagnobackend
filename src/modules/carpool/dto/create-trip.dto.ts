import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsDateString,
  IsUUID,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTripDto {
  @ApiProperty({ example: 'uuid-of-vehicle' })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ example: 'Paris' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  departureCity: string;

  @ApiProperty({ example: 'Lyon' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  arrivalCity: string;

  @ApiProperty({ example: '2024-12-25T10:00:00Z' })
  @IsDateString()
  departureTime: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  @Min(1)
  pricePerSeat: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  availableSeats: number;
}

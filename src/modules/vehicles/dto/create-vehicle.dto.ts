import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  brand: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  model: string;

  @ApiProperty({ example: 2020 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiProperty({ example: 'Blanc' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  color: string;

  @ApiProperty({ example: 'AB-123-CD' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  licensePlate: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(50)
  numberOfSeats: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isForRental?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isForCarpooling?: boolean;
}

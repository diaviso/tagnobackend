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

export class UpdateVehicleDto {
  @ApiProperty({ example: 'Toyota', required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'Corolla', required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 2020, required: false })
  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  year?: number;

  @ApiProperty({ example: 'Blanc', required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 5, required: false })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  numberOfSeats?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isForRental?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isForCarpooling?: boolean;
}

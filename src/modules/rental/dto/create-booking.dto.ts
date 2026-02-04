import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: '2024-12-25' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-12-30' })
  @IsDateString()
  endDate: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  seatsReserved: number;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Token de vérification email' })
  @IsString()
  @IsNotEmpty({ message: 'Le token est requis' })
  token: string;
}

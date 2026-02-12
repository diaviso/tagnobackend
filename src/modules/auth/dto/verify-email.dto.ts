import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Adresse email' })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({ description: 'Code de vérification à 6 chiffres' })
  @IsString()
  @IsNotEmpty({ message: 'Le code est requis' })
  code: string;
}

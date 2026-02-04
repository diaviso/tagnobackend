import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, Matches } from 'class-validator';

export class AddPhotoDto {
  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsString()
  @Matches(/^(https?:\/\/|\/uploads\/)/, { message: 'url must be a valid URL or upload path' })
  url: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
}

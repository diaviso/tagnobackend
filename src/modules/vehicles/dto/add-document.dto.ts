import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, Matches } from 'class-validator';

export enum DocumentType {
  INSURANCE = 'INSURANCE',
  REGISTRATION = 'REGISTRATION',
  TECHNICAL_VISIT = 'TECHNICAL_VISIT',
}

export class AddDocumentDto {
  @ApiProperty({ enum: DocumentType, example: DocumentType.INSURANCE })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ example: 'https://example.com/document.pdf' })
  @IsString()
  @Matches(/^(https?:\/\/|\/uploads\/)/, { message: 'fileUrl must be a valid URL or upload path' })
  fileUrl: string;
}

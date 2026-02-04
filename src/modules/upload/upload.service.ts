import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  getFileUrl(file: Express.Multer.File): { url: string } {
    const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3008';
    return {
      url: `${baseUrl}/uploads/${file.filename}`,
    };
  }
}

import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private readonly configService;
    constructor(configService: ConfigService);
    getFileUrl(file: Express.Multer.File): {
        url: string;
    };
}

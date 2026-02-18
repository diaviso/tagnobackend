import { Module, Logger } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

const logger = new Logger('MailModule');

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get('MAIL_HOST');
        const port = Number(config.get('MAIL_PORT', 465));
        const user = config.get('MAIL_USER');
        const from = config.get('MAIL_FROM');

        logger.log(`SMTP config: host=${host}, port=${port}, user=${user}, from=${from}`);

        if (!host) {
          logger.warn('MAIL_HOST is not defined! Emails will fail.');
        }

        return {
          transport: {
            host,
            port,
            secure: config.get('MAIL_SECURE', 'true') === 'true',
            auth: {
              user,
              pass: config.get('MAIL_PASS'),
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
          },
          defaults: {
            from,
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly frontendUrl: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  private baseTemplate(content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:28px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:1px;">TAAGNO</h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                ${content}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px;background:#f9fafb;text-align:center;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${new Date().getFullYear()} TAAGNO — Covoiturage & Location de véhicules au Sénégal</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>`;
  }

  private button(url: string, label: string): string {
    return `<table cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr><td align="center" style="background:#2563eb;border-radius:8px;">
        <a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">${label}</a>
      </td></tr>
    </table>`;
  }

  async sendVerificationEmail(to: string, firstName: string, token: string): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/verify-email?token=${token}`;

    const html = this.baseTemplate(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Bienvenue ${firstName} !</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;">
        Merci de vous être inscrit sur <strong>TAAGNO</strong>. Pour activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
      </p>
      ${this.button(verifyUrl, 'Vérifier mon email')}
      <p style="color:#6b7280;font-size:13px;">Ce lien expire dans <strong>24 heures</strong>.</p>
      <p style="color:#9ca3af;font-size:12px;margin-top:20px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
    `);

    try {
      await this.mailerService.sendMail({ to, subject: 'Vérifiez votre adresse email — TAAGNO', html });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, firstName: string): Promise<void> {
    const html = this.baseTemplate(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Bienvenue sur TAAGNO, ${firstName} ! 🎉</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;">
        Votre email a été vérifié avec succès. Votre compte est maintenant actif !
      </p>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;">Voici ce que vous pouvez faire :</p>
      <ul style="color:#4b5563;font-size:15px;line-height:1.8;padding-left:20px;">
        <li>🚗 <strong>Proposer un trajet</strong> en covoiturage</li>
        <li>🔑 <strong>Mettre votre véhicule</strong> en location</li>
        <li>🔍 <strong>Rechercher</strong> des trajets ou des véhicules disponibles</li>
      </ul>
      ${this.button(`${this.frontendUrl}/login`, 'Se connecter')}
    `);

    try {
      await this.mailerService.sendMail({ to, subject: 'Bienvenue sur TAAGNO ! 🚗', html });
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error);
    }
  }

  async sendPasswordResetEmail(to: string, firstName: string, token: string): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    const html = this.baseTemplate(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Réinitialisation de mot de passe</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;">
        Bonjour ${firstName},<br><br>
        Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
      </p>
      ${this.button(resetUrl, 'Réinitialiser mon mot de passe')}
      <p style="color:#6b7280;font-size:13px;">Ce lien expire dans <strong>1 heure</strong>.</p>
      <p style="color:#9ca3af;font-size:12px;margin-top:20px;">Si vous n'avez pas fait cette demande, ignorez cet email. Votre mot de passe ne sera pas modifié.</p>
    `);

    try {
      await this.mailerService.sendMail({ to, subject: 'Réinitialisation de votre mot de passe — TAAGNO', html });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}`, error);
      throw error;
    }
  }

  async sendPasswordChangedEmail(to: string, firstName: string): Promise<void> {
    const html = this.baseTemplate(`
      <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Mot de passe modifié</h2>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;">
        Bonjour ${firstName},<br><br>
        Votre mot de passe a été modifié avec succès. Si vous n'êtes pas à l'origine de cette modification, contactez-nous immédiatement.
      </p>
    `);

    try {
      await this.mailerService.sendMail({ to, subject: 'Votre mot de passe a été modifié — TAAGNO', html });
      this.logger.log(`Password changed email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password changed email to ${to}`, error);
    }
  }
}

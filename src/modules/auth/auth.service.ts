import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ResendCodeDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export interface GoogleProfile {
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // ==================== Google OAuth ====================

  async validateGoogleUser(profile: GoogleProfile) {
    let user = await this.usersService.findByGoogleId(profile.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(profile.email);

      if (user) {
        user = await this.usersService.updateGoogleId(user.id, profile.googleId);
      } else {
        user = await this.usersService.create({
          googleId: profile.googleId,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          photoUrl: profile.photoUrl,
        });
      }
    }

    return user;
  }

  // ==================== Email/Password Auth ====================

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    const verificationCode = this.generateVerificationCode();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    if (existingUser) {
      // If user exists and is already verified, block registration
      if (existingUser.emailVerified) {
        // If it's a Google-only account (no password), also block
        throw new BadRequestException('Un compte avec cet email existe déjà. Essayez de vous connecter.');
      }

      // User exists but NOT verified → regenerate code, update password, resend email
      await this.usersService.updateVerificationCode(
        existingUser.id,
        verificationCode,
        codeExpires,
        hashedPassword,
      );

      try {
        await this.mailService.sendVerificationEmail(
          dto.email,
          dto.firstName || existingUser.firstName || '',
          verificationCode,
        );
      } catch (error) {
        this.logger.error(`Failed to send verification email to ${dto.email}`, error);
        throw new InternalServerErrorException('Impossible d\'envoyer l\'email de vérification. Veuillez réessayer plus tard.');
      }

      return {
        message: 'Un nouveau code de vérification a été envoyé à votre adresse email.',
        email: dto.email,
      };
    }

    // New user → create account
    const user = await this.usersService.createWithPassword({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      verificationCode,
      verificationCodeExpires: codeExpires,
    });

    try {
      await this.mailService.sendVerificationEmail(user.email, user.firstName || '', verificationCode);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${user.email}`, error);
      throw new InternalServerErrorException('Inscription enregistrée mais l\'envoi de l\'email a échoué. Utilisez "Renvoyer le code" pour réessayer.');
    }

    return {
      message: 'Inscription réussie ! Un code de vérification a été envoyé à votre adresse email.',
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Veuillez vérifier votre email avant de vous connecter. Vérifiez votre boîte de réception.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Votre compte a été désactivé');
    }

    const tokenResult = await this.generateToken(user);

    return {
      access_token: tokenResult.access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userMode: user.userMode,
      },
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.usersService.findByVerificationCode(code, email);

    if (!user) {
      throw new BadRequestException('Code de vérification invalide ou expiré. Veuillez réessayer.');
    }

    await this.usersService.verifyEmail(user.id);

    // Send welcome email (non-blocking)
    try {
      await this.mailService.sendWelcomeEmail(user.email, user.firstName || '');
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${user.email}`, error);
    }

    return { message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.' };
  }

  async resendCode(dto: ResendCodeDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      // Don't reveal if account exists
      return { message: 'Si un compte non vérifié existe avec cet email, un nouveau code a été envoyé.' };
    }

    if (user.emailVerified) {
      throw new BadRequestException('Ce compte est déjà vérifié. Vous pouvez vous connecter.');
    }

    const verificationCode = this.generateVerificationCode();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000);

    await this.usersService.updateVerificationCode(user.id, verificationCode, codeExpires);

    try {
      await this.mailService.sendVerificationEmail(user.email, user.firstName || '', verificationCode);
    } catch (error) {
      this.logger.error(`Failed to resend verification email to ${user.email}`, error);
      throw new InternalServerErrorException('Impossible d\'envoyer l\'email de vérification. Veuillez réessayer plus tard.');
    }

    return { message: 'Un nouveau code de vérification a été envoyé à votre adresse email.' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Always return success to prevent email enumeration
    if (!user || !user.password) {
      return { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.usersService.setResetPasswordToken(user.id, resetToken, expires);

    try {
      await this.mailService.sendPasswordResetEmail(user.email, user.firstName || '', resetToken);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${user.email}`, error);
      throw new InternalServerErrorException('Impossible d\'envoyer l\'email de réinitialisation. Veuillez réessayer plus tard.');
    }

    return { message: 'Un lien de réinitialisation a été envoyé à votre adresse email.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByResetToken(dto.token);

    if (!user) {
      throw new BadRequestException('Token de réinitialisation invalide ou expiré');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    await this.usersService.resetPassword(user.id, hashedPassword);

    // Send confirmation email (non-blocking)
    try {
      await this.mailService.sendPasswordChangedEmail(user.email, user.firstName || '');
    } catch (error) {
      this.logger.error(`Failed to send password changed email to ${user.email}`, error);
    }

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  // ==================== Common ====================

  async generateToken(user: { id: string; email: string; role: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async validateJwtPayload(payload: JwtPayload) {
    return this.usersService.findById(payload.sub);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendCodeDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // ==================== Email/Password Auth ====================

  @Post('register')
  @ApiOperation({ summary: 'Inscription par email/mot de passe' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion par email/mot de passe' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Vérifier l\'email avec le code' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.email, dto.code);
  }

  @Post('resend-code')
  @ApiOperation({ summary: 'Renvoyer le code de vérification' })
  async resendCode(@Body() dto: ResendCodeDto) {
    return this.authService.resendCode(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Demander la réinitialisation du mot de passe' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Réinitialiser le mot de passe' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ==================== Google OAuth ====================

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initier la connexion Google OAuth2' })
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback Google OAuth2' })
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.generateToken(req.user);

    // Redirect to frontend with token
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/login?token=${result.access_token}`);
  }

  // ==================== Common ====================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer l\'utilisateur connecté' })
  async getMe(@CurrentUser() user: any) {
    return user;
  }
}

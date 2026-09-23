import { Controller, Get, Post, Query, Body } from '@nestjs/common';

import { AuthService } from './auth.service';

import { EmailVerificationService } from './email-verification.service';

import { LoginDto } from './dto/login.dto';

import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.emailVerificationService.verifyToken(token);
  }
}

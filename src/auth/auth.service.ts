import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from './email.service';
import { EmailVerificationService } from './email-verification.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );

    const verificationToken = await this.emailVerificationService.createToken(
      user.id,
    );

    await this.emailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationToken.token,
    );

    return {
      message: 'User registered successfully. Please check your email.',
      user,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please verify your email before logging in.',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }
}

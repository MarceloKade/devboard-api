import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailVerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createToken(userId: string) {
    const token = randomBytes(32).toString('hex');

    const expiresAt = new Date();

    expiresAt.setHours(expiresAt.getHours() + 48);

    return this.prisma.emailVerificationToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async verifyToken(token: string) {
    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: {
          token,
        },
        include: {
          user: true,
        },
      });

    if (!verificationToken) {
      throw new BadRequestException('Invalid verification token');
    }

    if (verificationToken.expiresAt < new Date()) {
      await this.prisma.emailVerificationToken.delete({
        where: {
          id: verificationToken.id,
        },
      });

      throw new BadRequestException('Verification token has expired');
    }

    await this.prisma.user.update({
      where: {
        id: verificationToken.userId,
      },
      data: {
        emailVerified: true,
      },
    });

    await this.prisma.emailVerificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    return {
      message: 'Email verified successfully',
    };
  }
}

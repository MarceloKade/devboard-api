import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailVerificationCleanupService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 * * * *')
  async removeExpiredUsers() {
    const now = new Date();

    await this.prisma.user.deleteMany({
      where: {
        emailVerified: false,
        verificationToken: {
          is: {
            expiresAt: {
              lt: now,
            },
          },
        },
      },
    });
  }
}

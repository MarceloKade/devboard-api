import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: string,
    userId: string,
    type: string,
    message: string,
  ) {
    return this.prisma.projectActivity.create({
      data: {
        projectId,
        userId,
        type,
        message,
      },
    });
  }

  async findAll(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      throw new NotFoundException(
        'Projeto não encontrado ou você não tem acesso a ele.',
      );
    }

    return this.prisma.projectActivity.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

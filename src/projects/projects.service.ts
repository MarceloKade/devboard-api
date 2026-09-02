import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ownerId: string) {
    return this.prisma.project.findMany({
      where: {
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, ownerId: string) {
    return this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });
  }

  async create(ownerId: string, createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        ownerId,
      },
    });
  }

  async update(id: string, ownerId: string, data: UpdateProjectDto) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!project) {
      return null;
    }

    return this.prisma.project.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId,
      },
    });

    if (!project) {
      return null;
    }

    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}

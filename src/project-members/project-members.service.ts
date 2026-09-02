import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

    if (!project) {
      return null;
    }

    return this.prisma.projectMember.findMany({
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
        createdAt: 'asc',
      },
    });
  }

  async add(
    projectId: string,
    ownerId: string,
    addProjectMemberDto: AddProjectMemberDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

    if (!project) {
      return null;
    }

    return this.prisma.projectMember.create({
      data: {
        projectId,
        userId: addProjectMemberDto.userId,
        role: addProjectMemberDto.role,
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
    });
  }

  async update(
    projectId: string,
    memberId: string,
    ownerId: string,
    updateProjectMemberDto: UpdateProjectMemberDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

    if (!project) {
      return null;
    }

    return this.prisma.projectMember.update({
      where: {
        id: memberId,
      },
      data: {
        role: updateProjectMemberDto.role,
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
    });
  }

  async remove(projectId: string, memberId: string, ownerId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });

    if (!project) {
      return null;
    }

    return this.prisma.projectMember.delete({
      where: {
        id: memberId,
      },
    });
  }
}

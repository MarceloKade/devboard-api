import { Injectable, NotFoundException } from '@nestjs/common';

import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import { PrismaService } from '../prisma/prisma.service';

import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectActivitiesService: ProjectActivitiesService,
  ) {}

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

    const user = await this.prisma.user.findUnique({
      where: {
        email: addProjectMemberDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const member = await this.prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
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

    await this.projectActivitiesService.create(
      projectId,
      ownerId,
      'MEMBER_ADDED',
      `Adicionou ${user.name} ao projeto`,
    );

    return member;
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

    const member = await this.prisma.projectMember.findFirst({
      where: {
        id: memberId,
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
    });

    if (!member) {
      return null;
    }

    const updatedMember = await this.prisma.projectMember.update({
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

    if (member.role !== updatedMember.role) {
      await this.projectActivitiesService.create(
        projectId,
        ownerId,
        'MEMBER_ROLE_CHANGED',
        `Alterou a role de ${member.user.name} de ${member.role} para ${updatedMember.role}`,
      );
    }

    return updatedMember;
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

    const member = await this.prisma.projectMember.findFirst({
      where: {
        id: memberId,
        projectId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!member) {
      return null;
    }

    await this.projectActivitiesService.create(
      projectId,
      ownerId,
      'MEMBER_REMOVED',
      `Removeu ${member.user.name} do projeto`,
    );

    return this.prisma.projectMember.delete({
      where: {
        id: memberId,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';

import { ProjectActivitiesService } from '../project-activities/project-activities.service';
import { PrismaService } from '../prisma/prisma.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectActivitiesService: ProjectActivitiesService,
  ) {}

  private async getProjectAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          {
            ownerId: userId,
          },
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
        ownerId: true,
        members: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    const isOwner = project.ownerId === userId;
    const isAdmin =
      isOwner || project.members.some((member) => member.role === 'ADMIN');

    return {
      isAdmin,
    };
  }

  async create(
    projectId: string,
    userId: string,
    createTaskDto: CreateTaskDto,
  ) {
    const access = await this.getProjectAccess(projectId, userId);

    if (!access) {
      return null;
    }

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        projectId,
        createdById: userId,
      },
    });

    await this.projectActivitiesService.create(
      projectId,
      userId,
      'TASK_CREATED',
      `Criou a task "${task.title}"`,
    );

    return task;
  }

  async findAll(projectId: string, userId: string) {
    const access = await this.getProjectAccess(projectId, userId);

    if (!access) {
      return null;
    }

    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        createdBy: {
          select: {
            avatar: true,
          },
        },
      },
    });
  }

  async findOne(projectId: string, taskId: string, userId: string) {
    const access = await this.getProjectAccess(projectId, userId);

    if (!access) {
      return null;
    }

    return this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
      include: {
        createdBy: {
          select: {
            avatar: true,
          },
        },
      },
    });
  }

  async update(
    projectId: string,
    taskId: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const access = await this.getProjectAccess(projectId, userId);

    if (!access) {
      return null;
    }

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!task) {
      return null;
    }

    const canEdit = access.isAdmin || task.createdById === userId;

    if (!canEdit) {
      return null;
    }

    const updatedTask = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateTaskDto,
      include: {
        createdBy: {
          select: {
            avatar: true,
          },
        },
      },
    });

    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      await this.projectActivitiesService.create(
        projectId,
        userId,
        'TASK_STATUS_CHANGED',
        `Alterou o status da task "${updatedTask.title}" de ${task.status} para ${updatedTask.status}`,
      );
    }

    if (updateTaskDto.priority && updateTaskDto.priority !== task.priority) {
      await this.projectActivitiesService.create(
        projectId,
        userId,
        'TASK_PRIORITY_CHANGED',
        `Alterou a prioridade da task "${updatedTask.title}" de ${task.priority} para ${updatedTask.priority}`,
      );
    }

    if (updateTaskDto.title && updateTaskDto.title !== task.title) {
      await this.projectActivitiesService.create(
        projectId,
        userId,
        'TASK_TITLE_CHANGED',
        `Alterou o título da task de "${task.title}" para "${updatedTask.title}"`,
      );
    }

    if (
      updateTaskDto.description !== undefined &&
      updateTaskDto.description !== task.description
    ) {
      await this.projectActivitiesService.create(
        projectId,
        userId,
        'TASK_DESCRIPTION_CHANGED',
        `Alterou a descrição da task "${updatedTask.title}"`,
      );
    }

    return updatedTask;
  }

  async remove(projectId: string, taskId: string, userId: string) {
    const access = await this.getProjectAccess(projectId, userId);

    if (!access || !access.isAdmin) {
      return null;
    }

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!task) {
      return null;
    }

    await this.projectActivitiesService.create(
      projectId,
      userId,
      'TASK_DELETED',
      `Excluiu a task "${task.title}"`,
    );

    return this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}

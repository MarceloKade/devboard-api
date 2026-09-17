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

  async create(
    projectId: string,
    ownerId: string,
    createTaskDto: CreateTaskDto,
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

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        projectId,
      },
    });

    await this.projectActivitiesService.create(
      projectId,
      ownerId,
      'TASK_CREATED',
      `Criou a task "${task.title}"`,
    );

    return task;
  }

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

    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(projectId: string, taskId: string, ownerId: string) {
    return this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
        project: {
          ownerId,
        },
      },
    });
  }

  async update(
    projectId: string,
    taskId: string,
    ownerId: string,
    updateTaskDto: UpdateTaskDto,
  ) {
    const task = await this.findOne(projectId, taskId, ownerId);

    if (!task) {
      return null;
    }

    const updatedTask = await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateTaskDto,
    });

    if (updateTaskDto.status && updateTaskDto.status !== task.status) {
      await this.projectActivitiesService.create(
        projectId,
        ownerId,
        'TASK_STATUS_CHANGED',
        `Alterou o status da task "${updatedTask.title}" de ${task.status} para ${updatedTask.status}`,
      );
    }

    if (updateTaskDto.priority && updateTaskDto.priority !== task.priority) {
      await this.projectActivitiesService.create(
        projectId,
        ownerId,
        'TASK_PRIORITY_CHANGED',
        `Alterou a prioridade da task "${updatedTask.title}" de ${task.priority} para ${updatedTask.priority}`,
      );
    }

    if (updateTaskDto.title && updateTaskDto.title !== task.title) {
      await this.projectActivitiesService.create(
        projectId,
        ownerId,
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
        ownerId,
        'TASK_DESCRIPTION_CHANGED',
        `Alterou a descrição da task "${updatedTask.title}"`,
      );
    }

    return updatedTask;
  }

  async remove(projectId: string, taskId: string, ownerId: string) {
    const task = await this.findOne(projectId, taskId, ownerId);

    if (!task) {
      return null;
    }

    await this.projectActivitiesService.create(
      projectId,
      ownerId,
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

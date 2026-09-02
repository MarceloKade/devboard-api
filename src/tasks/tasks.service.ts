import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        projectId,
      },
    });
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

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: updateTaskDto,
    });
  }

  async remove(projectId: string, taskId: string, ownerId: string) {
    const task = await this.findOne(projectId, taskId, ownerId);

    if (!task) {
      return null;
    }

    return this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}

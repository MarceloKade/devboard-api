import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ProjectActivitiesService } from './project-activities.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    email: string;
  };
};

@Controller('projects/:projectId/activities')
@UseGuards(JwtAuthGuard)
export class ProjectActivitiesController {
  constructor(
    private readonly projectActivitiesService: ProjectActivitiesService,
  ) {}

  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
    @Param('projectId') projectId: string,
  ) {
    return this.projectActivitiesService.findAll(
      projectId,
      request.user.userId,
    );
  }
}

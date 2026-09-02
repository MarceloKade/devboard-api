import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { AddProjectMemberDto } from './dto/add-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { ProjectMembersService } from './project-members.service';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    email: string;
  };
};

@Controller('projects/:projectId/members')
@UseGuards(JwtAuthGuard)
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Get()
  findAll(
    @Req() request: AuthenticatedRequest,
    @Param('projectId') projectId: string,
  ) {
    return this.projectMembersService.findAll(projectId, request.user.userId);
  }

  @Post()
  add(
    @Req() request: AuthenticatedRequest,
    @Param('projectId') projectId: string,
    @Body() addProjectMemberDto: AddProjectMemberDto,
  ) {
    return this.projectMembersService.add(
      projectId,
      request.user.userId,
      addProjectMemberDto,
    );
  }

  @Patch(':memberId')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Body() updateProjectMemberDto: UpdateProjectMemberDto,
  ) {
    return this.projectMembersService.update(
      projectId,
      memberId,
      request.user.userId,
      updateProjectMemberDto,
    );
  }

  @Delete(':memberId')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.projectMembersService.remove(
      projectId,
      memberId,
      request.user.userId,
    );
  }
}

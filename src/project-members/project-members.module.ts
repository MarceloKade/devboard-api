import { Module } from '@nestjs/common';

import { ProjectActivitiesModule } from '../project-activities/project-activities.module';

import { ProjectMembersController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';

@Module({
  imports: [ProjectActivitiesModule],
  controllers: [ProjectMembersController],
  providers: [ProjectMembersService],
})
export class ProjectMembersModule {}

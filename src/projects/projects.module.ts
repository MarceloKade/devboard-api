import { Module } from '@nestjs/common';

import { ProjectActivitiesModule } from '../project-activities/project-activities.module';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [ProjectActivitiesModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}

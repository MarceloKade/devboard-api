import { Module } from '@nestjs/common';

import { ProjectActivitiesService } from './project-activities.service';
import { ProjectActivitiesController } from './project-activities.controller';

@Module({
  controllers: [ProjectActivitiesController],
  providers: [ProjectActivitiesService],
  exports: [ProjectActivitiesService],
})
export class ProjectActivitiesModule {}

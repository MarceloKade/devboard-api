import { Module } from '@nestjs/common';

import { ProjectActivitiesModule } from '../project-activities/project-activities.module';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [ProjectActivitiesModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

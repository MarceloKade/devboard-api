import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { ProjectActivitiesModule } from './project-activities/project-activities.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    ProjectMembersModule,
    ProjectActivitiesModule,
  ],
})
export class AppModule {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectActivityDto } from './create-project-activity.dto';

export class UpdateProjectActivityDto extends PartialType(CreateProjectActivityDto) {}

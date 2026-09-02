import { IsIn, IsString, IsUUID } from 'class-validator';

export class AddProjectMemberDto {
  @IsUUID()
  userId: string;

  @IsString()
  @IsIn(['ADMIN', 'MEMBER'])
  role: string;
}

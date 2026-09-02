import { IsIn, IsString } from 'class-validator';

export class UpdateProjectMemberDto {
  @IsString()
  @IsIn(['ADMIN', 'MEMBER'])
  role: string;
}

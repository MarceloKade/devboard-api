import { IsEmail, IsIn } from 'class-validator';

export class AddProjectMemberDto {
  @IsEmail()
  email: string;

  @IsIn(['ADMIN', 'MEMBER'])
  role: string;
}

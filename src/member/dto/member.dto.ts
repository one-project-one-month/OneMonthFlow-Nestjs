import { IsString, IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class RegisterMemberDto {
  @IsString()
  @IsNotEmpty()
  memberName: string;

  @IsString()
  @IsNotEmpty()
  githubAccountName: string;

  @IsString()
  nrc: string;

  @IsString()
  @IsNotEmpty()
  mobileNo: string;

  @IsUUID()
  teamCode: string;

  @IsUUID()
  projectCode: string;
}

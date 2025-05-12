import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddMemberToTeamDto {
  @IsNotEmpty()
  @IsString()
  memberCode: string;

  @IsNotEmpty()
  @IsString()
  teamCode: string;

  @IsString()
  projectCode: string;
}

export class AddTeamToProjectDto {
  @IsNotEmpty()
  @IsString()
  teamCode: string;

  @IsNotEmpty()
  @IsString()
  projectCode: string;
}

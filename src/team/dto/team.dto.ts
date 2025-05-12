import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddMemberToTeamDto {
  @IsUUID()
  @IsNotEmpty()
  memberCode: string;

  @IsUUID()
  @IsNotEmpty()
  teamCode: string;

  @IsUUID()
  projectCode: string;
}

export class AddTeamToProjectDto {
  @IsUUID()
  @IsNotEmpty()
  teamCode: string;

  @IsUUID()
  @IsNotEmpty()
  projectCode: string;
}

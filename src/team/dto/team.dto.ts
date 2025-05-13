import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  teamName: string;
}

export class UpdateTeamDto {
  @IsOptional()
  @IsString()
  teamName?: string;
}

export class TeamResponseDto {
  teamId: number;
  teamCode: string;
  teamName: string;
  createdDate: Date;
  updatedDate: Date;
}

export class AddMemberToTeamDto {
  @IsNotEmpty()
  @IsString()
  memberCode: string;

  @IsNotEmpty()
  @IsString()
  teamCode: string;

  @IsString()
  @IsOptional()
  projectCode?: string;
}

export class AddTeamToProjectDto {
  @IsNotEmpty()
  @IsString()
  teamCode: string;

  @IsNotEmpty()
  @IsString()
  projectCode: string;
}

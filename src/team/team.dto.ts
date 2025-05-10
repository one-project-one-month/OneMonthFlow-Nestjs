import { IsUUID } from 'class-validator';

export class AddMemberToTeamDto {
  @IsUUID()
  memberCode: string;

  @IsUUID()
  teamCode: string;

  @IsUUID()
  projectCode: string;
}

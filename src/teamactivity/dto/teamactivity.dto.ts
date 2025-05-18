import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class TeamActivityCreateDto{
    @IsNotEmpty()
    @IsString()
    userCode: string;

    @IsNotEmpty()
    @IsString()
    teamCode: string;

    @IsNotEmpty()
    @IsString()
    projectCode: string;

    @IsNotEmpty()
    @IsString()
    techStackCode: string;

    @IsNotEmpty()
    @IsDate()
    activityDate: Date;

    @IsNotEmpty()
    @IsString()
    task: string;
}

export class TeamActivityResponseDto {
    teamActivityId: number;
    userCode: string;
    teamCode: string;
    projectCode: string;
    techStackCode: string;
    activityDate: Date;
    task: string;
    createdDate: Date;
    createdBy: string;
  }

  export class UpdateTeamActivityDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    @IsString()
    userCode: string;

    @IsNotEmpty()
    @IsString()
    teamCode: string;

    @IsNotEmpty()
    @IsString()
    projectCode: string;

    @IsNotEmpty()
    @IsString()
    techStackCode: string;

    @IsNotEmpty()
    @IsDate()
    activityDate: Date;

    @IsNotEmpty()
    @IsString()
    task: string;
  }
  
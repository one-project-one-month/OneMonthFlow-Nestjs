import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsOptional()
  @IsString()
  repoUrl?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  projectDescription?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  projectStatus?: ProjectStatus;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsString()
  repoUrl?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  projectDescription?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  projectStatus?: ProjectStatus;
}

export class ProjectResponseDto {
  projectId: number;
  projectCode: string;
  projectName: string;
  repoUrl?: string;
  startDate?: Date;
  endDate?: Date;
  projectDescription?: string;
  projectStatus?: string;
  createdDate: Date;
  updatedDate: Date;
}
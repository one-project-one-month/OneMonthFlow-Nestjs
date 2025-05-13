import { IsString, IsNotEmpty, IsOptional, IsAlphanumeric, MaxLength } from 'class-validator';

export class CreateTechStackDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  techStackName: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(5)
  techStackShortCode?: string;
}

export class UpdateTechStackDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  techStackName?: string;

  @IsOptional()
  @IsAlphanumeric()
  @MaxLength(5)
  techStackShortCode?: string;
}

export class TechStackResponseDto {
  techStackId: number;
  techStackCode: string;
  techStackShortCode?: string;
  techStackName: string;
  createdDate: Date;
  updatedDate: Date;
}
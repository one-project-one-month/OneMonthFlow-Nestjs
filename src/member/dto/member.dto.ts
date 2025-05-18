import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsUUID,
  IsDecimal,
  IsOptional,
  isNotEmpty,
} from 'class-validator';

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

  team?: Array<{
    teamCode: string;
  }>;

  @IsString()
  @IsOptional()
  projectCode: string;

  techStacks?: Array<{
    techStackCode: string;
    proficiencyLevel: number;
  }>;
}

export class createMemberTechStackDto {
  @IsNotEmpty()
  techStacks: Array<{
    memberCode: string;
    techStackCode: string;
    proficiencyLevel: number;
  }>;
}

export class updateMemberTechStackDto {
  @IsNotEmpty()
  memberCode: string;

  @IsNotEmpty()
  techStacks: Array<{
    techStackCode: string;
    proficiencyLevel: number;
  }>;
}

export interface MemberTableTypes {
  MEMBER_ID: number;
  MEMBER_CODE: string;
  MEMBER_NAME: string;
  GITHUB_ACCOUNT_NAME?: string | null;
  NRC?: string | null;
  MOBILE_NO?: string | null;
  CREATED_DATE: Date;
  CREATED_BY?: string | null;
  UPDATED_DATE: Date;
  DEL_FLAG: number;
}

export interface TechStackTableTypes {
  TECHSTACK_ID: number;
  TECHSTACK_CODE: string;
  TECHSTACK_SHORT_CODE?: string | null;
  TECHSTACK_NAME: string;
  CREATED_DATE: Date;
  CREATED_BY?: string | null;
  UPDATED_DATE: Date;
  DEL_FLAG: number;
}

export interface MemberTechStackTableTypes {
  MEMBER_TECHSTACK_ID: number;
  MEMBER_CODE: string;
  TECHSTACK_CODE: string;
  PROFICIENCY_LEVEL?: number | null;
  CREATED_DATE: Date;
  CREATED_BY?: string | null;
  UPDATED_DATE: Date;
  DEL_FLAG: number;
}

export interface TeamTableTypes {
  TEAM_ID: number;
  TEAM_CODE: string;
  TEAM_NAME: string;
  CREATED_DATE: Date;
  CREATED_BY?: string | null;
  UPDATED_DATE: Date;
  DEL_FLAG: number;
}

export interface ProjectTableTypes {
  PROJECT_ID: number;
  PROJECT_CODE: string;
  PROJECT_NAME: string;
  REPO_URL?: string | null;
  START_DATE?: Date | null;
  END_DATE?: Date | null;
  PROJECT_DESCRIPTION?: string | null;
  PROJECT_STATUS?: string | null;
  CREATED_DATE: Date;
  CREATED_BY?: string | null;
  UPDATED_DATE: Date;
  DEL_FLAG: number;
}

export interface ProjectTeamTableTypes {
  PROJECT_TEAM_ID: number;
  PROJECT_CODE: string;
  TEAM_CODE: string;
  PROJECT_TEAM_RANKING?: number | null;
  DURATION?: number | null;
  CREATED_DATE: Date;
  CREATED_BY?: string | null;
  UPDATED_DATE: Date;
  DEL_FLAG: number;
}

export interface TBL_TEAMMEMBER {
  TEAM_MEMBER_ID: number;
  TEAM_CODE: string;
  MEMBER_CODE: string;
  MEMBER_RATING?: number | null;
  CREATED_DATE: Date;
  CREATED_BY?: string | null;
  UPDATED_DATE: Date;
  DEL_FLAG: number;
}

export interface TBL_PROJECTTEAMACTIVITY {
  PROJECT_TEAM_ACTIVITY_ID: number;
  MEMBER_CODE: string;
  TEAM_CODE: string;
  PROJECT_CODE: string;
  TECHSTACK_CODE: string;
  ACTIVITY_DATE?: Date | null;
  TASKS?: string | null;
  CREATED_DATE: Date;
  CREATED_BY?: string | null;
  UPDATED_DATE: Date;
  DEL_FLAG: number;
}

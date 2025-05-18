import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createMemberTechStackDto,
  RegisterMemberDto,
  updateMemberTechStackDto,
} from './dto';
import { ResultService } from 'src/result/result.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  private mapToMemberResponse(member: any): RegisterMemberDto {
    return {
      memberName: member.MEMBER_NAME,
      githubAccountName: member.GITHUB_ACCOUNT_NAME,
      mobileNo: member.MOBILE_NO,
      nrc: member.NRC,
      techStacks: member.TECHSTACK,
    };
  }

  async registerMember(
    req: RegisterMemberDto,
  ): Promise<ResultService<RegisterMemberDto>> {
    const {
      memberName,
      githubAccountName,
      nrc,
      mobileNo,
      teamCode,
      projectCode,
      techStacks,
    } = req;

    // Validate required fields
    if (!memberName || !githubAccountName || !mobileNo) {
      // throw new BadRequestException(
      //   'Member name, GitHub account name, and mobile number are required',
      // );
      return ResultService.NotFoundError(
        'Member name, GitHub account name, and mobile number are required',
        404,
      );
    }

    try {
      // 1. Create the member
      const member = await this.prisma.tBL_MEMBER.create({
        data: {
          MEMBER_CODE: crypto.randomUUID(),
          MEMBER_NAME: memberName,
          GITHUB_ACCOUNT_NAME: githubAccountName,
          NRC: nrc,
          MOBILE_NO: mobileNo,
        },
      });

      // 2. Link member to techstacks if provided
      if (techStacks && techStacks.length > 0) {
        await this.prisma.$transaction(
          techStacks.map((item) =>
            this.prisma.tBL_MEMBERTECHSTACK.create({
              data: {
                MEMBER_CODE: member.MEMBER_CODE,
                TECHSTACK_CODE: item.techStackCode,
                PROFICIENCY_LEVEL: item.proficiencyLevel,
              },
            }),
          ),
        );
      }

      // 3. Link member to team if team is provided
      if (teamCode) {
        // Create team member relationship
        await this.prisma.tBL_TEAMMEMBER.create({
          data: {
            TEAM_CODE: teamCode,
            MEMBER_CODE: member.MEMBER_CODE,
          },
        });
      }

      // 4 Create project-team relationship if projectCode is provided
      if (teamCode && projectCode) {
        const projectTeam = await this.prisma.tBL_PROJECTTEAM.findFirst({
          where: {
            PROJECT_CODE: projectCode,
            TEAM_CODE: teamCode,
          },
        });

        if (!projectTeam) {
          await this.prisma.tBL_PROJECTTEAM.create({
            data: {
              PROJECT_CODE: projectCode,
              TEAM_CODE: teamCode,
            },
          });
        }
      }

      const model = this.mapToMemberResponse(member);
      // return { success: true, member };
      return ResultService.Success(model);
    } catch (error) {
      throw new Error(`Failed to register member: ${error.message}`);
    }
  }

  private mapToMemberTechStackResponse(member: any): createMemberTechStackDto {
    return {
      memberCode: member.MEMBER_CODE,
      techStacks: member.TECHSTACK,
    };
  }

  async createMemberTechStack(
    req: createMemberTechStackDto,
  ): Promise<ResultService<createMemberTechStackDto>> {
    const { memberCode, techStacks } = req;

    if (!techStacks || techStacks.length === 0) {
      // throw new BadRequestException(
      //   'TechStacks array is required and must not be empty',
      // );
      return ResultService.NotFoundError(
        'TechStacks array is required and must not be empty',
        404,
      );
    }

    try {
      // Create all member-techstack relationships in a single transaction

      const createdTechStacks = await this.prisma.$transaction(
        techStacks.map((item) =>
          this.prisma.tBL_MEMBERTECHSTACK.create({
            data: {
              MEMBER_CODE: memberCode,
              TECHSTACK_CODE: item.techStackCode,
              PROFICIENCY_LEVEL: item.proficiencyLevel,
            },
          }),
        ),
      );

      // return { success: true, createdTechStacks };
      const model = this.mapToMemberTechStackResponse(createdTechStacks);
      return ResultService.Success(model);
    } catch (error) {
      // throw new BadRequestException(
      //   `Failed to create member techstack: ${error.message}`,
      // );
      return ResultService.SystemError(
        `Failed to create member techstack: ${error.message}`,
        500,
      );
    }
  }

  async updateMemberTechStack(
    req: updateMemberTechStackDto,
  ): Promise<ResultService<updateMemberTechStackDto>> {
    const { memberCode, techStacks } = req;

    if (!techStacks || techStacks.length === 0) {
      // throw new BadRequestException(
      //   'TechStacks array is required and must not be empty',
      // );
      return ResultService.NotFoundError(
        'TechStacks array is required and must not be empty',
        404,
      );
    }

    try {
      // First, delete existing techstack relationships for this member
      await this.prisma.tBL_MEMBERTECHSTACK.deleteMany({
        where: {
          MEMBER_CODE: memberCode,
        },
      });

      // Then create new techstack relationships
      const updatedTechStacks = await this.prisma.$transaction(
        techStacks.map((item) =>
          this.prisma.tBL_MEMBERTECHSTACK.create({
            data: {
              MEMBER_CODE: memberCode,
              TECHSTACK_CODE: item.techStackCode,
              PROFICIENCY_LEVEL: item.proficiencyLevel,
            },
          }),
        ),
      );

      const model = this.mapToMemberTechStackResponse(updatedTechStacks);
      // return { success: true, updatedTechStacks };
      return ResultService.Success(model);
    } catch (error) {
      // throw new BadRequestException(
      //   `Failed to update member techstack: ${error.message}`,
      // );
      return ResultService.SystemError(
        `Failed to update member techstack: ${error.message}`,
        500,
      );
    }
  }
}

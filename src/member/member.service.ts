import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createMemberTechStackDto, RegisterMemberDto, updateMemberTechStackDto } from './dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async registerMember(req: RegisterMemberDto) {
    const {
      memberName,
      githubAccountName,
      nrc,
      mobileNo,
      team,
      projectCode,
      techStacks,
    } = req;

    // Validate required fields
    if (!memberName || !githubAccountName || !mobileNo) {
      throw new BadRequestException(
        'Member name, GitHub account name, and mobile number are required',
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
        for await (const item of techStacks) {
          await this.prisma.tBL_MEMBERTECHSTACK.create({
            data: {
              MEMBER_CODE: member.MEMBER_CODE,
              TECHSTACK_CODE: item.techStackCode,
              PROFICIENCY_LEVEL: item.proficiencyLevel,
            },
          });
        }
      }

      // 3. Link member to team if team is provided
      if (team && team.length > 0) {
        for await (const teamMember of team) {
          const teamCode = teamMember.teamCode;

          // Create team member relationship
          await this.prisma.tBL_TEAMMEMBER.create({
            data: {
              TEAM_CODE: teamCode,
              MEMBER_CODE: member.MEMBER_CODE,
            },
          });

          // Create project-team relationship if projectCode is provided
          if (projectCode) {
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
        }
      }

      return { success: true, member };
    } catch (error) {
      throw new Error(`Failed to register member: ${error.message}`);
    }
  }

  async createMemberTechStack(req: createMemberTechStackDto) {
    const { techStacks } = req;

    if (!techStacks || techStacks.length === 0) {
      throw new BadRequestException('TechStacks array is required and must not be empty');
    }

    try {
      // Create all member-techstack relationships in a single transaction
      const createdTechStacks = await this.prisma.$transaction(
        techStacks.map(item =>
          this.prisma.tBL_MEMBERTECHSTACK.create({
            data: {
              MEMBER_CODE: item.memberCode,
              TECHSTACK_CODE: item.techStackCode,
              PROFICIENCY_LEVEL: item.proficiencyLevel,
            },
          }),
        ),
      );

      return { success: true, createdTechStacks };
    } catch (error) {
      throw new BadRequestException(`Failed to create member techstack: ${error.message}`);
    }
  }

  async updateMemberTechStack(req: updateMemberTechStackDto) {
    const { memberCode, techStacks } = req;

    if (!techStacks || techStacks.length === 0) {
      throw new BadRequestException('TechStacks array is required and must not be empty');
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
        techStacks.map(item =>
          this.prisma.tBL_MEMBERTECHSTACK.create({
            data: {
              MEMBER_CODE: memberCode,
              TECHSTACK_CODE: item.techStackCode,
              PROFICIENCY_LEVEL: item.proficiencyLevel,
            },
          }),
        ),
      );

      return { success: true, updatedTechStacks };
    } catch (error) {
      throw new BadRequestException(`Failed to update member techstack: ${error.message}`);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterMemberDto } from './dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async registerMember(req: RegisterMemberDto) {
    const { memberName, githubAccountName, nrc, mobileNo, teamCode, projectCode } = req;
    const { v4: uuidv4 } = await import('uuid');
    const MEMBER_CODE = uuidv4();
    try {
      // 1. Create the member
      const member = await this.prisma.tBL_MEMBER.create({
        data: {
          MEMBER_CODE,
          MEMBER_NAME: memberName,
          GITHUB_ACCOUNT_NAME: githubAccountName,
          NRC: nrc,
          MOBILE_NO: mobileNo,
        },
      });

      // 2. Link member to team if teamCode is provided
      if (teamCode) {
        await this.prisma.tBL_TEAMMEMBER.create({
          data: {
            TEAM_CODE: teamCode,
            MEMBER_CODE: MEMBER_CODE,
          },
        });
      }

      // 3. Ensure project-team relationship exists if projectCode is provided
      if (projectCode && teamCode) {
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

      return { success: true, member };
    } catch (error) {
      throw new Error(`Failed to register member: ${error.message}`);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddMemberToTeamDto, AddTeamToProjectDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) { }

  async addMemberToTeam(req: AddMemberToTeamDto) {
    const { memberCode, teamCode, projectCode } = req;
    try {
      // 1. Add member to team
      await this.prisma.tBL_TEAMMEMBER.create({
        data: {
          TEAM_CODE: teamCode,
          MEMBER_CODE: memberCode,
        },
      });
      // 2. Ensure project-team relationship exists
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
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to add member to team: ${error.message}`);
    }
  }

  async addTeamToProject(req: AddTeamToProjectDto) {
    const { teamCode, projectCode } = req;
    try {
      // Check if the project-team relation already exists
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
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to add team to project: ${error.message}`);
    }
  }
}

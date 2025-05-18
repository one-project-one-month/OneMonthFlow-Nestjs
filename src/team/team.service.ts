import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddMemberToTeamDto,
  AddTeamToProjectDto,
  CreateTeamDto,
  UpdateTeamDto,
  TeamResponseDto,
} from './dto/team.dto';
import { ResultService } from 'src/result/result.service';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  private mapToTeamResponse(team: any): TeamResponseDto {
    return {
      teamId: team.TEAM_ID,
      teamCode: team.TEAM_CODE,
      teamName: team.TEAM_NAME,
      createdDate: team.CREATED_DATE,
      updatedDate: team.UPDATED_DATE,
    };
  }

  async createTeam(createTeamDto: CreateTeamDto) {
    try {
      const team = await this.prisma.tBL_TEAM.create({
        data: {
          TEAM_CODE: crypto.randomUUID(),
          TEAM_NAME: createTeamDto.teamName,
        },
      });
      // return this.mapToTeamResponse(team);
      return ResultService.Success(team);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  async findAllTeams() {
    const teams = await this.prisma.tBL_TEAM.findMany({
      where: {
        DEL_FLAG: 0,
      },
      orderBy: {
        CREATED_DATE: 'desc',
      },
    });
    // return teams.map(team => this.mapToTeamResponse(team));
    return ResultService.Success(teams);
  }

  async findTeamByCode(teamCode: string) {
    try {
      const team = await this.prisma.tBL_TEAM.findUnique({
        where: {
          TEAM_CODE: teamCode,
          DEL_FLAG: 0,
        },
      });

      if (!team) {
        throw new NotFoundException(`Team with code ${teamCode} not found`);
      }

      return ResultService.Success(team);
    } catch (error) {
      return ResultService.SystemError(error.message,  500);
    }
  }

  async updateTeam(teamCode: string, updateTeamDto: UpdateTeamDto) {
    try {
      const existingTeam = await this.prisma.tBL_TEAM.findUnique({
        where: {
          TEAM_CODE: teamCode,
          DEL_FLAG: 0,
        },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Team with code ${teamCode} not found`);
      }

      const updatedTeam = await this.prisma.tBL_TEAM.update({
        where: { TEAM_CODE: teamCode },
        data: {
          TEAM_NAME: updateTeamDto.teamName,
        },
      });

      // return this.mapToTeamResponse(updatedTeam);
      return ResultService.Success(updatedTeam);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  async removeTeam(teamCode: string) {
    try {
      const existingTeam = await this.prisma.tBL_TEAM.findUnique({
        where: {
          TEAM_CODE: teamCode,
          DEL_FLAG: 0,
        },
      });

      if (!existingTeam) {
        throw new NotFoundException(`Team with code ${teamCode} not found`);
      }

      await this.prisma.tBL_TEAM.update({
        where: { TEAM_CODE: teamCode },
        data: { DEL_FLAG: 1 },
      });

      return ResultService.Success(null);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  async addMemberToTeam(req: AddMemberToTeamDto) {
    const { memberCode, teamCode, projectCode } = req;
    try {
      // Check if team exists
      const team = await this.prisma.tBL_TEAM.findUnique({
        where: {
          TEAM_CODE: teamCode,
          DEL_FLAG: 0,
        },
      });

      if (!team) {
        throw new NotFoundException(`Team with code ${teamCode} not found`);
      }

      // Check if member exists
      const member = await this.prisma.tBL_MEMBER.findUnique({
        where: {
          MEMBER_CODE: memberCode,
          DEL_FLAG: 0,
        },
      });

      if (!member) {
        throw new NotFoundException(`Member with code ${memberCode} not found`);
      }

      // Add member to team
      await this.prisma.tBL_TEAMMEMBER.create({
        data: {
          TEAM_CODE: teamCode,
          MEMBER_CODE: memberCode,
        },
      });

      // Ensure project-team relationship exists if projectCode is provided
      if (projectCode) {
        const project = await this.prisma.tBL_PROJECT.findUnique({
          where: {
            PROJECT_CODE: projectCode,
            DEL_FLAG: 0,
          },
        });

        if (!project) {
          throw new NotFoundException(
            `Project with code ${projectCode} not found`,
          );
        }

        const projectTeam = await this.prisma.tBL_PROJECTTEAM.findFirst({
          where: {
            PROJECT_CODE: projectCode,
            TEAM_CODE: teamCode,
            DEL_FLAG: 0,
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

      return ResultService.Success(null);
    } catch (error) {
      return ResultService.SystemError(error.message,  500);
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
      return ResultService.Success(null);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }
}

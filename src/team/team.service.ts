import { Injectable, NotFoundException, Res } from '@nestjs/common';
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

  async createTeam(
    createTeamDto: CreateTeamDto,
  ): Promise<ResultService<TeamResponseDto>> {
    try {
      const team = await this.prisma.tBL_TEAM.create({
        data: {
          TEAM_CODE: crypto.randomUUID(),
          TEAM_NAME: createTeamDto.teamName,
        },
      });
      const model = this.mapToTeamResponse(team);
      // return this.mapToTeamResponse(team);
      return ResultService.Success(model);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  async findAllTeams(): Promise<ResultService<TeamResponseDto[]>> {
    const teams = await this.prisma.tBL_TEAM.findMany({
      where: {
        DEL_FLAG: 0,
      },
      orderBy: {
        CREATED_DATE: 'desc',
      },
    });
    // return teams.map(team => this.mapToTeamResponse(team));
    const model = teams.map((team) => this.mapToTeamResponse(team));
    return ResultService.Success(model);
  }

  async findTeamByCode(
    teamCode: string,
  ): Promise<ResultService<TeamResponseDto>> {
    try {
      const team = await this.prisma.tBL_TEAM.findUnique({
        where: {
          TEAM_CODE: teamCode,
          DEL_FLAG: 0,
        },
      });

      if (!team) {
        // throw new NotFoundException(`Team with code ${teamCode} not found`);
        return ResultService.NotFoundError(
          `Team with code ${teamCode} not found`,
          404,
        );
      }
      const model = this.mapToTeamResponse(team);
      return ResultService.Success(model);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  async updateTeam(
    teamCode: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<ResultService<TeamResponseDto>> {
    try {
      const existingTeam = await this.prisma.tBL_TEAM.findUnique({
        where: {
          TEAM_CODE: teamCode,
          DEL_FLAG: 0,
        },
      });

      if (!existingTeam) {
        // throw new NotFoundException(`Team with code ${teamCode} not found`);
        return ResultService.ValidationError(
          `Team with code ${teamCode} not found`,
          403,
        );
      }

      const updatedTeam = await this.prisma.tBL_TEAM.update({
        where: { TEAM_CODE: teamCode },
        data: {
          TEAM_NAME: updateTeamDto.teamName,
        },
      });

      // return this.mapToTeamResponse(updatedTeam);
      const model = this.mapToTeamResponse(updateTeamDto);
      return ResultService.Success(model);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  async removeTeam(
    teamCode: string,
  ): Promise<ResultService<{ success: boolean }>> {
    try {
      const existingTeam = await this.prisma.tBL_TEAM.findUnique({
        where: {
          TEAM_CODE: teamCode,
          DEL_FLAG: 0,
        },
      });

      if (!existingTeam) {
        // throw new NotFoundException(`Team with code ${teamCode} not found`);
        return ResultService.ValidationError(
          `Team with code ${teamCode} not found`,
          403,
        );
      }

      await this.prisma.tBL_TEAM.update({
        where: { TEAM_CODE: teamCode },
        data: { DEL_FLAG: 1 },
      });

      const model = { success: true };
      return ResultService.Success(model);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  async addMemberToTeam(
    req: AddMemberToTeamDto,
  ): Promise<ResultService<{ success: boolean }>> {
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
        // throw new NotFoundException(`Team with code ${teamCode} not found`);
        return ResultService.NotFoundError(
          `Team with code ${teamCode} not found`,
          404,
        );
      }

      // Check if member exists
      const member = await this.prisma.tBL_MEMBER.findUnique({
        where: {
          MEMBER_CODE: memberCode,
          DEL_FLAG: 0,
        },
      });

      if (!member) {
        // throw new NotFoundException(`Member with code ${memberCode} not found`);
        return ResultService.NotFoundError(
          `Member with code ${memberCode} not found`,
          404,
        );
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
          // throw new NotFoundException(
          //   `Project with code ${projectCode} not found`,
          // );
          return ResultService.NotFoundError(
            `Project with code ${projectCode} not found`,
            404,
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
      const model = { success: true };
      return ResultService.Success(model);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  async addTeamToProject(
    req: AddTeamToProjectDto,
  ): Promise<ResultService<{ success: boolean }>> {
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
      const model = { success: true };
      return ResultService.Success(model);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }
}

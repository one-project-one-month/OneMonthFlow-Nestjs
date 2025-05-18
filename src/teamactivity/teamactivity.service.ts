import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TeamActivityCreateDto, TeamActivityResponseDto, UpdateTeamActivityDto } from './dto/teamactivity.dto';

@Injectable()
export class TeamactivityService {
    constructor(private prisma: PrismaService) { }

    private mapToTeamResponse(teamActivity: any): TeamActivityResponseDto {
        return {
            teamActivityId: teamActivity.TEAM_ACTIVITY_ID,
            userCode: teamActivity.MEMBER_CODE,
            teamCode: teamActivity.TEAM_CODE,
            projectCode: teamActivity.PROJECT_CODE,
            techStackCode: teamActivity.TECH_STACK_CODE,
            activityDate: teamActivity.ACTIVITY_DATE,
            task: teamActivity.TASK,
            createdDate: teamActivity.CREATED_DATE,
            createdBy: teamActivity.CREATED_BY
        };
    }

    async teamActivityCreate(teamActivityCreateDto: TeamActivityCreateDto): Promise<TeamActivityResponseDto> {
        const teamActivityCreate = await this.prisma.tBL_PROJECTTEAMACTIVITY.create({
            data: {
                MEMBER_CODE: teamActivityCreateDto.userCode,
                TEAM_CODE: teamActivityCreateDto.teamCode,
                PROJECT_CODE: teamActivityCreateDto.projectCode,
                TECHSTACK_CODE: teamActivityCreateDto.techStackCode,
                ACTIVITY_DATE: teamActivityCreateDto.activityDate,
                TASKS: teamActivityCreateDto.task
            },
        });
        return this.mapToTeamResponse(teamActivityCreate);
    }

    async findTeamActivity(): Promise<TeamActivityResponseDto[]> {
        const teamActivityList = await this.prisma.tBL_PROJECTTEAMACTIVITY.findMany({
            where: {
                DEL_FLAG: 0
            },
            orderBy: {
                CREATED_DATE: 'desc'
            }
        });
        return teamActivityList.map(team => this.mapToTeamResponse(team));
    }

    async findTeamActivityById(id: number): Promise<TeamActivityResponseDto> {
        const teamActivityEdit = await this.prisma.tBL_PROJECTTEAMACTIVITY.findUnique({
            where: {
                PROJECT_TEAM_ACTIVITY_ID: id,
                DEL_FLAG: 0
            }
        });

        if (!teamActivityEdit) {
            throw new NotFoundException(`Team Activity Task not found`);
        }

        return this.mapToTeamResponse(teamActivityEdit);
    }

    async updateTeamActivity(updateTeamActivityDto: UpdateTeamActivityDto): Promise<TeamActivityResponseDto> {
        const existingTeam = await this.prisma.tBL_PROJECTTEAMACTIVITY.findUnique({
            where: {
                PROJECT_TEAM_ACTIVITY_ID: updateTeamActivityDto.id,
                DEL_FLAG: 0
            }
        });

        if (!existingTeam) {
            throw new NotFoundException(`Team Activity Task not found`);
        }

        const updatedTeam = await this.prisma.tBL_PROJECTTEAMACTIVITY.update({
            where: { PROJECT_TEAM_ACTIVITY_ID: updateTeamActivityDto.id },
            data: {
                MEMBER_CODE: updateTeamActivityDto.userCode,
                TEAM_CODE: updateTeamActivityDto.teamCode,
                PROJECT_CODE: updateTeamActivityDto.projectCode,
                TECHSTACK_CODE: updateTeamActivityDto.techStackCode,
                ACTIVITY_DATE: updateTeamActivityDto.activityDate,
                TASKS: updateTeamActivityDto.task,
            },
        });

        return this.mapToTeamResponse(updatedTeam);
    }
}

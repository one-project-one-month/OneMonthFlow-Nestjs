import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  AddMemberToTeamDto,
  AddTeamToProjectDto,
  CreateTeamDto,
  UpdateTeamDto,
  TeamResponseDto,
} from './dto/team.dto';
import { TeamService } from './team.service';
import { ResultService } from 'src/result/result.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(
    @Body() createTeamDto: CreateTeamDto,
  ): Promise<ResultService<TeamResponseDto>> {
    return this.teamService.createTeam(createTeamDto);
  }

  @Get()
  async findAll(): Promise<ResultService<TeamResponseDto[]>> {
    return this.teamService.findAllTeams();
  }

  @Get(':code')
  async findOne(
    @Param('code') code: string,
  ): Promise<ResultService<TeamResponseDto>> {
    return this.teamService.findTeamByCode(code);
  }

  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<ResultService<TeamResponseDto>> {
    return this.teamService.updateTeam(code, updateTeamDto);
  }

  @Delete(':code')
  async remove(
    @Param('code') code: string,
  ): Promise<ResultService<{ success: boolean }>> {
    return this.teamService.removeTeam(code);
  }

  @Post('add-member')
  async addMemberToTeam(
    @Body() addMemberToTeamDto: AddMemberToTeamDto,
  ): Promise<ResultService<{ success: boolean }>> {
    const result = await this.teamService.addMemberToTeam(addMemberToTeamDto);
    return result;
  }

  @Post('add-project')
  async addTeamToProject(
    @Body() addTeamToProjectDto: AddTeamToProjectDto,
  ): Promise<ResultService<{ success: boolean }>> {
    const result = await this.teamService.addTeamToProject(addTeamToProjectDto);
    return result;
  }
}

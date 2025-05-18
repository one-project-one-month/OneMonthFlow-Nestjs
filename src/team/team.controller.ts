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

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.createTeam(createTeamDto);
  }

  @Get()
  async findAll() {
    return this.teamService.findAllTeams();
  }

  @Get(':code')
  async findOne(@Param('code') code: string) {
    return this.teamService.findTeamByCode(code);
  }

  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamService.updateTeam(code, updateTeamDto);
  }

  @Delete(':code')
  async remove(@Param('code') code: string) {
    return this.teamService.removeTeam(code);
  }

  @Post('add-member')
  async addMemberToTeam(@Body() addMemberToTeamDto: AddMemberToTeamDto) {
    const result = await this.teamService.addMemberToTeam(addMemberToTeamDto);
    return result;
  }

  @Post('add-project')
  async addTeamToProject(@Body() addTeamToProjectDto: AddTeamToProjectDto) {
    const result = await this.teamService.addTeamToProject(addTeamToProjectDto);
    return result;
  }
}

import { Controller, Post, Body } from '@nestjs/common';
import { AddMemberToTeamDto, AddTeamToProjectDto } from './dto/team.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }
  @Post('/add-member')
  async addMemberToTeam(@Body() addMemberToTeamDto: AddMemberToTeamDto) {
    try {
      const result = await this.teamService.addMemberToTeam(addMemberToTeamDto);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('/add-project')
  async addTeamToProject(@Body() addTeamToProjectDto: AddTeamToProjectDto) {
    try {
      const result = await this.teamService.addTeamToProject(addTeamToProjectDto);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

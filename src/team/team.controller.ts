import { Controller, Post, Body } from '@nestjs/common';
import { AddMemberToTeamDto } from './team.dto';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Post('/add-member')
  async addMemberToTeam(@Body() addMemberToTeamDto: AddMemberToTeamDto) {
    try {
      const result = await this.teamService.addMemberToTeam(addMemberToTeamDto);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

    @Post("/add-project")
    addProject() {
      return { message: 'This is add team into project route.' };
    }
}

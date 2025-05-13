import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Put, 
  Delete, 
  Query 
} from '@nestjs/common';
import { 
  CreateProjectDto, 
  UpdateProjectDto, 
  ProjectResponseDto,
  ProjectStatus
} from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto
  ): Promise<ProjectResponseDto> {
    return this.projectService.createProject(createProjectDto);
  }

  @Get()
  async findAll(): Promise<ProjectResponseDto[]> {
    return this.projectService.findAllProjects();
  }

  @Get(':code')
  async findOne(
    @Param('code') code: string
  ): Promise<ProjectResponseDto> {
    return this.projectService.findProjectByCode(code);
  }

  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectService.updateProject(code, updateProjectDto);
  }

  @Delete(':code')
  async remove(
    @Param('code') code: string
  ): Promise<{ success: boolean }> {
    return this.projectService.removeProject(code);
  }
}

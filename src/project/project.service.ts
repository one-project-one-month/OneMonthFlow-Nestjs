import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateProjectDto, 
  UpdateProjectDto, 
  ProjectResponseDto,
  ProjectStatus
} from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  private mapToProjectResponse(project: any): ProjectResponseDto {
    return {
      projectId: project.PROJECT_ID,
      projectCode: project.PROJECT_CODE,
      projectName: project.PROJECT_NAME,
      repoUrl: project.REPO_URL || undefined,
      startDate: project.START_DATE || undefined,
      endDate: project.END_DATE || undefined,
      projectDescription: project.PROJECT_DESCRIPTION || undefined,
      projectStatus: project.PROJECT_STATUS || ProjectStatus.PLANNING,
      createdDate: project.CREATED_DATE,
      updatedDate: project.UPDATED_DATE
    };
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<ProjectResponseDto> {
    const project = await this.prisma.tBL_PROJECT.create({
      data: {
        PROJECT_CODE: crypto.randomUUID(),
        PROJECT_NAME: createProjectDto.projectName,
        REPO_URL: createProjectDto.repoUrl,
        START_DATE: createProjectDto.startDate ? new Date(createProjectDto.startDate) : null,
        END_DATE: createProjectDto.endDate ? new Date(createProjectDto.endDate) : null,
        PROJECT_DESCRIPTION: createProjectDto.projectDescription,
        PROJECT_STATUS: createProjectDto.projectStatus
      },
    });

    return this.mapToProjectResponse(project);
  }

  async findAllProjects(): Promise<ProjectResponseDto[]> {
    const projects = await this.prisma.tBL_PROJECT.findMany({
      where: {
        DEL_FLAG: 0
      },
      orderBy: {
        CREATED_DATE: 'desc'
      }
    });
    
    return projects.map(project => this.mapToProjectResponse(project));
  }

  async findProjectByCode(projectCode: string): Promise<ProjectResponseDto> {
    const project = await this.prisma.tBL_PROJECT.findUnique({
      where: { 
        PROJECT_CODE: projectCode,
        DEL_FLAG: 0 
      }
    });

    if (!project) {
      throw new NotFoundException(`Project with code ${projectCode} not found`);
    }

    return this.mapToProjectResponse(project);
  }

  async updateProject(projectCode: string, updateProjectDto: UpdateProjectDto): Promise<ProjectResponseDto> {
    const existingProject = await this.prisma.tBL_PROJECT.findUnique({
      where: { 
        PROJECT_CODE: projectCode,
        DEL_FLAG: 0 
      }
    });

    if (!existingProject) {
      throw new NotFoundException(`Project with code ${projectCode} not found`);
    }

    const updatedProject = await this.prisma.tBL_PROJECT.update({
      where: { PROJECT_CODE: projectCode },
      data: {
        PROJECT_NAME: updateProjectDto.projectName,
        REPO_URL: updateProjectDto.repoUrl,
        START_DATE: updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : null,
        END_DATE: updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : null,
        PROJECT_DESCRIPTION: updateProjectDto.projectDescription,
        PROJECT_STATUS: updateProjectDto.projectStatus
      },
    });

    return this.mapToProjectResponse(updatedProject);
  }

  async removeProject(projectCode: string): Promise<{ success: boolean }> {
    const existingProject = await this.prisma.tBL_PROJECT.findUnique({
      where: { 
        PROJECT_CODE: projectCode,
        DEL_FLAG: 0 
      }
    });

    if (!existingProject) {
      throw new NotFoundException(`Project with code ${projectCode} not found`);
    }


    await this.prisma.tBL_PROJECT.update({
      where: { PROJECT_CODE: projectCode },
      data: { DEL_FLAG: 1 },
    });

    return { success: true };
  }
}

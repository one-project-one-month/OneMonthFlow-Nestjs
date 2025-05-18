import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
  ProjectStatus,
} from './dto/project.dto';
import { ResultService } from 'src/result/result.service';

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
      updatedDate: project.UPDATED_DATE,
    };
  }

  async createProject(
    createProjectDto: CreateProjectDto,
  ): Promise<ResultService<ProjectResponseDto>> {
    const project = await this.prisma.tBL_PROJECT.create({
      data: {
        PROJECT_CODE: crypto.randomUUID(),
        PROJECT_NAME: createProjectDto.projectName,
        REPO_URL: createProjectDto.repoUrl,
        START_DATE: createProjectDto.startDate
          ? new Date(createProjectDto.startDate)
          : null,
        END_DATE: createProjectDto.endDate
          ? new Date(createProjectDto.endDate)
          : null,
        PROJECT_DESCRIPTION: createProjectDto.projectDescription,
        PROJECT_STATUS: createProjectDto.projectStatus,
      },
    });
    const model = this.mapToProjectResponse(project);
    return ResultService.Success(model);
  }

  async findAllProjects(): Promise<ResultService<ProjectResponseDto[]>> {
    const projects = await this.prisma.tBL_PROJECT.findMany({
      where: {
        DEL_FLAG: 0,
      },
      orderBy: {
        CREATED_DATE: 'desc',
      },
    });

    const model = projects.map((project) => this.mapToProjectResponse(project));
    return ResultService.Success(model);
  }

  async findProjectByCode(
    projectCode: string,
  ): Promise<ResultService<ProjectResponseDto>> {
    const project = await this.prisma.tBL_PROJECT.findUnique({
      where: {
        PROJECT_CODE: projectCode,
        DEL_FLAG: 0,
      },
    });

    if (!project) {
      // throw new NotFoundException(`Project with code ${projectCode} not found`);
      return ResultService.NotFoundError(
        `Project with code ${projectCode} not found`,
        404,
      );
    }

    const model = this.mapToProjectResponse(project);
    return ResultService.Success(model);
  }

  async updateProject(
    projectCode: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ResultService<ProjectResponseDto>> {
    const existingProject = await this.prisma.tBL_PROJECT.findUnique({
      where: {
        PROJECT_CODE: projectCode,
        DEL_FLAG: 0,
      },
    });

    if (!existingProject) {
      // throw new NotFoundException(`Project with code ${projectCode} not found`);
      return ResultService.NotFoundError(
        `Project with code ${projectCode} not found`,
        404,
      );
    }

    const updatedProject = await this.prisma.tBL_PROJECT.update({
      where: { PROJECT_CODE: projectCode },
      data: {
        PROJECT_NAME: updateProjectDto.projectName,
        REPO_URL: updateProjectDto.repoUrl,
        START_DATE: updateProjectDto.startDate
          ? new Date(updateProjectDto.startDate)
          : null,
        END_DATE: updateProjectDto.endDate
          ? new Date(updateProjectDto.endDate)
          : null,
        PROJECT_DESCRIPTION: updateProjectDto.projectDescription,
        PROJECT_STATUS: updateProjectDto.projectStatus,
      },
    });
    const model = this.mapToProjectResponse(updatedProject);
    return ResultService.Success(model);
  }

  async removeProject(
    projectCode: string,
  ): Promise<ResultService<{ success: boolean }>> {
    const existingProject = await this.prisma.tBL_PROJECT.findUnique({
      where: {
        PROJECT_CODE: projectCode,
        DEL_FLAG: 0,
      },
    });

    if (!existingProject) {
      // throw new NotFoundException(`Project with code ${projectCode} not found`);
      return ResultService.NotFoundError(
        `Project with code ${projectCode} not found`,
        404,
      );
    }

    await this.prisma.tBL_PROJECT.update({
      where: { PROJECT_CODE: projectCode },
      data: { DEL_FLAG: 1 },
    });
    const model = { success: true };
    return ResultService.Success(model);
  }
}

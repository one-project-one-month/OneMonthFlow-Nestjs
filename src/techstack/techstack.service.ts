import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateTechStackDto, 
  UpdateTechStackDto, 
  TechStackResponseDto 
} from './dto/techstack.dto';

@Injectable()
export class TechstackService {
  constructor(private prisma: PrismaService) {}

  private mapToTechStackResponse(techstack: any): TechStackResponseDto {
    return {
      techStackId: techstack.TECHSTACK_ID,
      techStackCode: techstack.TECHSTACK_CODE,
      techStackShortCode: techstack.TECHSTACK_SHORT_CODE || undefined,
      techStackName: techstack.TECHSTACK_NAME,
      createdDate: techstack.CREATED_DATE,
      updatedDate: techstack.UPDATED_DATE
    };
  }

  async createTechStack(createTechStackDto: CreateTechStackDto): Promise<TechStackResponseDto> {
    // Check if tech stack with the same name already exists
    const existingTechStack = await this.prisma.tBL_TECHSTACK.findFirst({
      where: {
        TECHSTACK_NAME: createTechStackDto.techStackName,
        DEL_FLAG: 0
      }
    });

    if (existingTechStack) {
      throw new Error(`Tech stack with name '${createTechStackDto.techStackName}' already exists`);
    }

    const techstack = await this.prisma.tBL_TECHSTACK.create({
      data: {
        TECHSTACK_CODE: crypto.randomUUID(), // This will be overridden by Prisma's @default(uuid())
        TECHSTACK_SHORT_CODE: createTechStackDto.techStackShortCode,
        TECHSTACK_NAME: createTechStackDto.techStackName
      },
    });

    return this.mapToTechStackResponse(techstack);
  }

  async findAllTechStacks(): Promise<TechStackResponseDto[]> {
    const techstacks = await this.prisma.tBL_TECHSTACK.findMany({
      where: {
        DEL_FLAG: 0
      },
      orderBy: {
        CREATED_DATE: 'desc'
      }
    });
    
    return techstacks.map(techstack => this.mapToTechStackResponse(techstack));
  }

  async findTechStackByCode(techStackCode: string): Promise<TechStackResponseDto> {
    const techstack = await this.prisma.tBL_TECHSTACK.findFirst({
      where: { 
        TECHSTACK_CODE: techStackCode,
        DEL_FLAG: 0 
      }
    });

    if (!techstack) {
      throw new NotFoundException(`Tech stack with code ${techStackCode} not found`);
    }

    return this.mapToTechStackResponse(techstack);
  }

  async updateTechStack(
    techStackCode: string, 
    updateTechStackDto: UpdateTechStackDto
  ): Promise<TechStackResponseDto> {
    const existingTechStack = await this.prisma.tBL_TECHSTACK.findFirst({
      where: { 
        TECHSTACK_CODE: techStackCode,
        DEL_FLAG: 0 
      }
    });

    if (!existingTechStack) {
      throw new NotFoundException(`Tech stack with code ${techStackCode} not found`);
    }

    // Check if name is being updated and if the new name already exists
    if (updateTechStackDto.techStackName && 
        updateTechStackDto.techStackName !== existingTechStack.TECHSTACK_NAME) {
      const nameExists = await this.prisma.tBL_TECHSTACK.findFirst({
        where: {
          TECHSTACK_NAME: updateTechStackDto.techStackName,
          DEL_FLAG: 0,
          TECHSTACK_CODE: { not: techStackCode }
        }
      });

      if (nameExists) {
        throw new Error(`Tech stack with name '${updateTechStackDto.techStackName}' already exists`);
      }
    }

    const updatedTechStack = await this.prisma.tBL_TECHSTACK.update({
      where: { TECHSTACK_CODE: techStackCode },
      data: {
        TECHSTACK_SHORT_CODE: updateTechStackDto.techStackShortCode,
        TECHSTACK_NAME: updateTechStackDto.techStackName || undefined
      },
    });

    return this.mapToTechStackResponse(updatedTechStack);
  }

  async removeTechStack(techStackCode: string): Promise<{ success: boolean }> {
    const existingTechStack = await this.prisma.tBL_TECHSTACK.findFirst({
      where: { 
        TECHSTACK_CODE: techStackCode,
        DEL_FLAG: 0 
      }
    });

    if (!existingTechStack) {
      throw new NotFoundException(`Tech stack with code ${techStackCode} not found`);
    }

    // Check if tech stack is in use by any member
    const memberTechstackCount = await this.prisma.tBL_MEMBERTECHSTACK.count({
      where: {
        TECHSTACK_CODE: techStackCode,
        DEL_FLAG: 0
      }
    });

    if (memberTechstackCount > 0) {
      throw new Error('Cannot delete tech stack as it is being used by one or more members');
    }

    await this.prisma.tBL_TECHSTACK.update({
      where: { TECHSTACK_CODE: techStackCode },
      data: { DEL_FLAG: 1 },
    });

    return { success: true };
  }
}

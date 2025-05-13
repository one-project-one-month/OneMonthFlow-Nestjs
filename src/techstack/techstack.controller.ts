import { 
    Controller, 
    Post, 
    Body, 
    Get, 
    Param, 
    Put, 
    Delete, 
    UsePipes, 
    ValidationPipe 
  } from '@nestjs/common';
  import { 
    CreateTechStackDto, 
    UpdateTechStackDto, 
    TechStackResponseDto 
  } from './dto/techstack.dto';
  import { TechstackService } from './techstack.service';
  
  @Controller('tech-stacks')
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  export class TechstackController {
    constructor(private readonly techstackService: TechstackService) {}
  
    @Post()
    async create(
      @Body() createTechStackDto: CreateTechStackDto
    ): Promise<TechStackResponseDto> {
      return this.techstackService.createTechStack(createTechStackDto);
    }
  
    @Get()
    async findAll(): Promise<TechStackResponseDto[]> {
      return this.techstackService.findAllTechStacks();
    }
  
    @Get(':code')
    async findOne(
      @Param('code') code: string
    ): Promise<TechStackResponseDto> {
      return this.techstackService.findTechStackByCode(code);
    }
  
    @Put(':code')
    async update(
      @Param('code') code: string,
      @Body() updateTechStackDto: UpdateTechStackDto,
    ): Promise<TechStackResponseDto> {
      return this.techstackService.updateTechStack(code, updateTechStackDto);
    }
  
    @Delete(':code')
    async remove(
      @Param('code') code: string
    ): Promise<{ success: boolean }> {
      return this.techstackService.removeTechStack(code);
    }
  }
  
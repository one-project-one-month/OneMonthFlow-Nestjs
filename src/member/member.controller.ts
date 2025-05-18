import { Controller, Post, Body, Put } from '@nestjs/common';
import { createMemberTechStackDto, RegisterMemberDto, updateMemberTechStackDto } from './dto';
import { MemberService } from './member.service';
import { UpdateTechStackDto } from 'src/techstack/dto/techstack.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) { }
  @Post('/register')
  async registerMember(@Body() registerMemberDto: RegisterMemberDto) {
    try {
      const result = await this.memberService.registerMember(registerMemberDto);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Post('/tech-stack')
  async createMemberTechStack(@Body() createTechStack: createMemberTechStackDto) {
    try {
      const result = await this.memberService.createMemberTechStack(createTechStack);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Put('/tech-stack')
  async updateMemberTechStack(@Body() updateTechStack: updateMemberTechStackDto) {
    try {
      const result = await this.memberService.updateMemberTechStack(updateTechStack);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

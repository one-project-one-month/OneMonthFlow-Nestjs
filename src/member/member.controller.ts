import { Controller, Post, Body, Put } from '@nestjs/common';
import { createMemberTechStackDto, RegisterMemberDto, updateMemberTechStackDto } from './dto';
import { MemberService } from './member.service';
import { ResultService } from 'src/result/result.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) { }
  @Post('/register')
  async registerMember(@Body() registerMemberDto: RegisterMemberDto) {
    try {
      const result = await this.memberService.registerMember(registerMemberDto);
      return result;
    } catch (error) {
      // return { success: false, message: error.message };
      return ResultService.SystemError(error.message,null,500)
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

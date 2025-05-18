import { Controller, Post, Body, Put } from '@nestjs/common';
import {
  createMemberTechStackDto,
  RegisterMemberDto,
  updateMemberTechStackDto,
} from './dto';
import { MemberService } from './member.service';
import { ResultService } from 'src/result/result.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('/register')
  async registerMember(
    @Body() registerMemberDto: RegisterMemberDto,
  ): Promise<ResultService<RegisterMemberDto>> {
    return await this.memberService.registerMember(registerMemberDto);
  }

  @Post('/tech-stack')
  async createMemberTechStack(
    @Body() createTechStack: createMemberTechStackDto,
  ): Promise<ResultService<createMemberTechStackDto>> {
    return await this.memberService.createMemberTechStack(createTechStack);
  }

  @Put('/tech-stack')
  async updateMemberTechStack(
    @Body() updateTechStack: updateMemberTechStackDto,
  ): Promise<ResultService<updateMemberTechStackDto>> {
    return await this.memberService.updateMemberTechStack(updateTechStack);
  }
}

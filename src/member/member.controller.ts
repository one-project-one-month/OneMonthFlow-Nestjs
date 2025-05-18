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

  private mapToMemberResponse(member: any): RegisterMemberDto {
    return {
      memberName: member.MEMBER_NAME,
      githubAccountName: member.GITHUB_ACCOUNT_NAME,
      mobileNo: member.MOBILE_NO,
      nrc: member.NRC,
      projectCode: member.PROJECT_CODE,
      team: member.TEAM,
      techStacks: member.TECHSTACK,
    };
  }

  @Post('/register')
  async registerMember(
    @Body() registerMemberDto: RegisterMemberDto,
  ): Promise<ResultService<RegisterMemberDto>> {
    try {
      const result = await this.memberService.registerMember(registerMemberDto);
      const model = this.mapToMemberResponse(result);
      return ResultService.Success(model);
    } catch (error) {
      // return { success: false, message: error.message };
      return ResultService.SystemError(error.message, 500);
    }
  }

  private mapToMemberTechStackResponse(member: any): createMemberTechStackDto {
    return {
      memberCode: member.MEMBER_CODE,
      techStacks: member.TECHSTACK,
    };
  }

  @Post('/tech-stack')
  async createMemberTechStack(
    @Body() createTechStack: createMemberTechStackDto,
  ): Promise<ResultService<createMemberTechStackDto>> {
    try {
      const result =
        await this.memberService.createMemberTechStack(createTechStack);
      const model = this.mapToMemberTechStackResponse(result);
      return ResultService.Success(model);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }

  @Put('/tech-stack')
  async updateMemberTechStack(
    @Body() updateTechStack: updateMemberTechStackDto,
  ): Promise<ResultService<updateMemberTechStackDto>> {
    try {
      const result =
        await this.memberService.updateMemberTechStack(updateTechStack);
      const model = this.mapToMemberTechStackResponse(result);
      return ResultService.Success(model);
    } catch (error) {
      return ResultService.SystemError(error.message, 500);
    }
  }
}

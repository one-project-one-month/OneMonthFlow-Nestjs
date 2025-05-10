import { Controller, Post, Body } from '@nestjs/common';
import { RegisterMemberDto } from './dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
  @Post('/register')
  async registerMember(@Body() registerMemberDto: RegisterMemberDto) {
    try {
      const result = await this.memberService.registerMember(registerMemberDto);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

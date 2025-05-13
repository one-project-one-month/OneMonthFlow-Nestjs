import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MemberController } from './member/member.controller';
import { TeamController } from './team/team.controller';
import { ProjectController } from './project/project.controller';
import { MemberService } from './member/member.service';
import { MemberModule } from './member/member.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamService } from './team/team.service';
import { ProjectService } from './project/project.service';
import { TechstackController } from './techstack/techstack.controller';
import { TechstackService } from './techstack/techstack.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local'],
      isGlobal: true,
    }),
    MemberModule,
    PrismaModule  ],
  controllers: [AppController, MemberController, TeamController, ProjectController,TechstackController
  ],
  providers: [AppService, MemberService,TeamService,ProjectService,TechstackService],
})
export class AppModule {}

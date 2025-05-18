import { Module } from '@nestjs/common';
import { TeamactivityController } from './teamactivity.controller';
import { TeamactivityService } from './teamactivity.service';

@Module({
  controllers: [TeamactivityController],
  providers: [TeamactivityService]
})
export class TeamactivityModule {}

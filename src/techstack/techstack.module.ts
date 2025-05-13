import { Module } from '@nestjs/common';
import { TechstackController } from './techstack.controller';
import { TechstackService } from './techstack.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [TechstackController],
  providers: [
    TechstackService,
    PrismaService
  ],
  exports: [TechstackService]
})
export class TechstackModule {}

import { Module } from '@nestjs/common';
import { MembreCoService } from './membre_co.service';
import { MembreCoController } from './membre_co.controller';

@Module({
  controllers: [MembreCoController],
  providers: [MembreCoService],
})
export class MembreCoModule {}

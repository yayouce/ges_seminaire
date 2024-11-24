import { Module } from '@nestjs/common';
import { RapportService } from './rapport.service';
import { RapportController } from './rapport.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rapport } from './entities/rapport.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Rapport])],
  controllers: [RapportController],
  providers: [RapportService],
})
export class RapportModule {}

import { Module } from '@nestjs/common';
import { VisiteurService } from './visiteur.service';
import { VisiteurController } from './visiteur.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visiteur } from './entities/visiteur.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Visiteur])],
  controllers: [VisiteurController],
  providers: [VisiteurService],
})
export class VisiteurModule {}

import { Module } from '@nestjs/common';
import { VisiteurService } from './visiteur.service';
import { VisiteurController } from './visiteur.controller';

@Module({
  controllers: [VisiteurController],
  providers: [VisiteurService],
})
export class VisiteurModule {}

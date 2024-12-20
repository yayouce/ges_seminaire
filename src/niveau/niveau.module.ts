import { Module } from '@nestjs/common';
import { NiveauService } from './niveau.service';
import { NiveauController } from './niveau.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Niveau } from './entities/niveau.entity';
import { SeminaristeEntity } from 'src/seminariste/entities/seminariste.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Niveau,SeminaristeEntity])],
  controllers: [NiveauController],
  providers: [NiveauService],
  exports:[NiveauService]
})
export class NiveauModule {}

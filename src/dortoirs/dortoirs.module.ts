import { Module } from '@nestjs/common';
import { DortoirsService } from './dortoirs.service';
import { DortoirsController } from './dortoirs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dortoirEntity } from './entities/dortoir.entity';
import { MembreCoService } from 'src/membre_co/membre_co.service';
import { MembreCoModule } from 'src/membre_co/membre_co.module';

@Module({
  imports:[TypeOrmModule.forFeature([dortoirEntity]),MembreCoModule],
  controllers: [DortoirsController],
  providers: [DortoirsService],

  exports:[DortoirsService]
})
export class DortoirsModule {}

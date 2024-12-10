import { forwardRef, Module } from '@nestjs/common';
import { DortoirsService } from './dortoirs.service';
import { DortoirsController } from './dortoirs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dortoirEntity } from './entities/dortoir.entity';
import { MembreCoService } from 'src/membre_co/membre_co.service';
import { MembreCoModule } from 'src/membre_co/membre_co.module';
import { SeminaristeModule } from 'src/seminariste/seminariste.module';


@Module({
  imports:[TypeOrmModule.forFeature([dortoirEntity]),MembreCoModule,forwardRef(()=>SeminaristeModule)],
  controllers: [DortoirsController],
  providers: [DortoirsService],

  exports:[DortoirsService]
})
export class DortoirsModule {}

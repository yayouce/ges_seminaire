import { Module } from '@nestjs/common';
import { SeminaristeService } from './seminariste.service';
import { SeminaristeController } from './seminariste.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeminaristeEntity } from './entities/seminariste.entity';
import { DortoirsModule } from 'src/dortoirs/dortoirs.module';
import { NiveauModule } from 'src/niveau/niveau.module';

@Module({
  imports:[TypeOrmModule.forFeature([SeminaristeEntity]),DortoirsModule,NiveauModule],
  controllers: [SeminaristeController],
  providers: [SeminaristeService],
  exports:[SeminaristeService],
})
export class SeminaristeModule {}

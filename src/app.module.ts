import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DortoirsResolver } from './dortoirs/dortoirs.resolver';
import { DortoirsModule } from './dortoirs/dortoirs.module';
import { CommissionModule } from './commission/commission.module';
import { SeminaristeModule } from './seminariste/seminariste.module';
import { VisiteurModule } from './visiteur/visiteur.module';
import { MembreCoModule } from './membre_co/membre_co.module';

@Module({
  imports: [DortoirsModule, CommissionModule, SeminaristeModule, VisiteurModule, MembreCoModule],
  controllers: [AppController],
  providers: [AppService, DortoirsResolver],
})
export class AppModule {}

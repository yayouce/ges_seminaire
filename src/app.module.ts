import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DortoirsModule } from './dortoirs/dortoirs.module';
import { CommissionModule } from './commission/commission.module';
import { SeminaristeModule } from './seminariste/seminariste.module';
import { VisiteurModule } from './visiteur/visiteur.module';
import { MembreCoModule } from './membre_co/membre_co.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv'
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperadminModule } from './superadmin/superadmin.module';
import { PersonneModule } from './personne/personne.module';
import { AuthModule } from './Auth/auth.module';

dotenv.config()
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    DortoirsModule, CommissionModule, SeminaristeModule, VisiteurModule, MembreCoModule, SuperadminModule, PersonneModule,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

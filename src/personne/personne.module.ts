import { Module } from '@nestjs/common';
import { PersonneService } from './personne.service';
import { PersonneController } from './personne.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { personne } from './entities/personne.entity';
import { PassportModule } from '@nestjs/passport';
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';
import { MembreCoModule } from 'src/membre_co/membre_co.module';
import { JwtCustomModule } from 'src/Auth/jwt.module';
import { SeminaristeModule } from 'src/seminariste/seminariste.module';

@Module({


  imports:[
MembreCoModule,
JwtCustomModule,
  SeminaristeModule,
    TypeOrmModule.forFeature([ personne,MembreCoEntity  ]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
   
  ],
  controllers: [PersonneController],
  providers: [PersonneService],
  exports:[PersonneService]
})
export class PersonneModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './Auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { PersonneModule } from 'src/personne/personne.module';
import { PersonneService } from 'src/personne/personne.service';
import { JwtCustomModule } from './jwt.module';
import { MembreCoModule } from 'src/membre_co/membre_co.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';

@Module({
  imports: [PersonneModule,
    PassportModule,
    JwtCustomModule,
    TypeOrmModule.forFeature([MembreCoEntity])
  ],
 
  providers: [
    
    AuthService,
    JwtStrategy    
  ],
  controllers: [AuthController],
})
export class AuthModule {}

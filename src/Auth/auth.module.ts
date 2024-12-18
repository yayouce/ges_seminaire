import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PersonneModule } from 'src/personne/personne.module';
import { JwtCustomModule } from './jwt.module';
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

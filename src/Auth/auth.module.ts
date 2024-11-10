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

@Module({
  imports: [PersonneModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
 
  providers: [
    
    AuthService,
    JwtStrategy    
  ],
  controllers: [AuthController],
})
export class AuthModule {}

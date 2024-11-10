import { Module } from '@nestjs/common';
import { PersonneService } from './personne.service';
import { PersonneController } from './personne.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { personne } from './entities/personne.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/Auth/jwt.strategy';

@Module({


  imports:[

    TypeOrmModule.forFeature([ personne  ]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret:process.env.JWTSECRET,
      signOptions:{expiresIn:"1h"}
    })
  ],
  controllers: [PersonneController],
  providers: [PersonneService,JwtStrategy],
  exports:[PersonneService]
})
export class PersonneModule {}

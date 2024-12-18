import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';
import { payloadInterface } from 'src/Interfaces/payloadInterface.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(MembreCoEntity)
    private membreCoRepository:Repository<MembreCoEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload:payloadInterface) {

   const user= await this.membreCoRepository.findOne({where:{phonePers:payload.phonePers}})

   if(user){
    const {motPass,...result}=user
    delete user.motPass

    return result
   }

   else{
    throw new UnauthorizedException()
   }



  }
}
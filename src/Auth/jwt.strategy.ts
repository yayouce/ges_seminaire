import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';
import { Superadmin } from 'src/superadmin/entities/superadmin.entity';
import { payloadInterface } from 'src/Interfaces/payloadInterface.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(MembreCoEntity)
    private membreCoRepository:Repository<MembreCoEntity>
    ,
    @InjectRepository(Superadmin)
    private superAdminRepo: Repository<Superadmin>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload:payloadInterface) {

    // If token belongs to a superadmin, validate against superadmin repo
    if (payload?.isSuperAdmin) {
      const id = (payload as any).idSupAdmin || payload.loginSupAdmin;
      const superadmin = await this.superAdminRepo.findOne({
        where: id && id.length === 36 ? { idSupAdmin: id } : { loginSupAdmin: payload.loginSupAdmin },
      });

      if (!superadmin) throw new UnauthorizedException();

      return {
        idSupAdmin: superadmin.idSupAdmin,
        loginSupAdmin: superadmin.loginSupAdmin,
        isSuperAdmin: true,
        role: 'SUPERADMIN',
      };
    }

    // Otherwise, try to resolve a MembreCo by phone
    if (payload?.phonePers) {
      const user = await this.membreCoRepository.findOne({ where: { phonePers: payload.phonePers } });
      if (!user) throw new UnauthorizedException();
      // remove sensitive info
      // @ts-ignore
      delete user.motPass;
      return user;
    }

    throw new UnauthorizedException();



  }
}
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { personSigninDto } from 'src/personne/dto/personSignIn';
import { PersonneService } from 'src/personne/personne.service';
import * as bcrypt from "bcrypt"
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';
import { Superadmin } from 'src/superadmin/entities/superadmin.entity';


const saltOrRounds = 10;

@Injectable()
export class AuthService {





    constructor(
        private  personneService : PersonneService,
        private jwtService: JwtService,
        @InjectRepository(Superadmin)
        private superAdminRepo: Repository<Superadmin>
    ){}


   async signIn(signIndata:personSigninDto){
    const user = await this.personneService.findPersByPhone(signIndata.phonePers)
    
    
    if (!user || !await bcrypt.compare(signIndata.motPass, user?.motPass) ) {
      
        throw new NotFoundException("numero ou mot de passe incorecte");
      }

  


      const payload:any = { phonePers:  user.phonePers,rolePers:user.rolePers };
      if (user instanceof MembreCoEntity) {
        payload.roleMembre = user.roleMembre;
        payload.commissionId=user.commission?.idComi
    }

    return {
      user:user,
      access_token: await this.jwtService.signAsync(payload),
     
    };


    
  };
  



   async getuser(){
    const user=await this.personneService.getAllpersonne()

   }

   // Connexion pour les superadmins
   async signInSuperAdmin(signIndata: { loginSupAdmin: string; motPassSupAdmin: string }) {
    const superadmin = await this.superAdminRepo.findOne({
      where: { loginSupAdmin: signIndata.loginSupAdmin }
    });

    if (!superadmin || !await bcrypt.compare(signIndata.motPassSupAdmin, superadmin.motPassSupAdmin)) {
      throw new NotFoundException("Login ou mot de passe incorrect");
    }

    const payload = {
      loginSupAdmin: superadmin.loginSupAdmin,
      idSupAdmin: superadmin.idSupAdmin,
      isSuperAdmin: true
    };

    return {
      user: {
        loginSupAdmin: superadmin.loginSupAdmin,
        idSupAdmin: superadmin.idSupAdmin,
        role: 'SUPERADMIN'
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }



}
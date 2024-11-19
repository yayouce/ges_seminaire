import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatePersonneDto } from 'src/personne/dto/create-personne.dto';

import { personSigninDto } from 'src/personne/dto/personSignIn';
import { personne } from 'src/personne/entities/personne.entity';
import { PersonneService } from 'src/personne/personne.service';
import * as bcrypt from "bcrypt"
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';
import { roleMembre } from 'generique/rolemembre.enum';
import { log } from 'console';


const saltOrRounds = 10;

@Injectable()
export class AuthService {





    constructor(
        private  personneService : PersonneService,
        private jwtService: JwtService
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
      access_token: await this.jwtService.signAsync(payload),
     
    };


    
  };
  
  async signInSup(loginsup){

  }


//    async signUp(userCreate:CreatePersonneDto){


//     const user = await this.personneService.createPers(userCreate);
//     return user
//    }



   async getuser(){
    const user=await this.personneService.getAllpersonne()
    
   }

   

}
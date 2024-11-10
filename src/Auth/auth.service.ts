import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreatePersonneDto } from 'src/personne/dto/create-personne.dto';

import { personSigninDto } from 'src/personne/dto/personSignIn';
import { personne } from 'src/personne/entities/personne.entity';
import { PersonneService } from 'src/personne/personne.service';
import * as bcrypt from "bcrypt"


const saltOrRounds = 10;

@Injectable()
export class AuthService {





    constructor(
        private  personneService : PersonneService,
        private jwtService: JwtService
    ){}


   async signIn(signIndata:personSigninDto){
    const user = await this.personneService.findPersByPhone(signIndata.loginPers)
    if (user?.motPass !== signIndata.motPass) {
        throw new UnauthorizedException();
      }

      const payload = { sub:  user.phonePers,role:user.rolePers };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };

   };



//    async signUp(userCreate:CreatePersonneDto){


//     const user = await this.personneService.createPers(userCreate);
//     return user
//    }



   async getuser(){
    const user=await this.personneService.getAllpersonne()
    
   }

   

}
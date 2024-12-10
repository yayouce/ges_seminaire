import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';
import { CommissionEnum } from 'generique/commission.enum';
import { Repository } from 'typeorm';
import { Materiel } from './entities/materiel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { roleMembre } from 'generique/rolemembre.enum';

@Injectable()
export class MaterielService {


  constructor(
    @InjectRepository(Materiel)
    private materielRepo : Repository<Materiel>
   ){}
 
  async createMateriel(CreateMaterielDto: CreateMaterielDto,user) {
    const {membreCo,...creation} = CreateMaterielDto
  
      try{
  
        if(user?.roleMembre!==roleMembre.RESP){
          throw new UnauthorizedException()
        }
       
        const newMateriel= this.materielRepo.create({
  
          ...creation,
          membreCo : user
        }
        )
       this.materielRepo.save(newMateriel)
      }
      catch(err){
        throw new UnauthorizedException(`vous n'êtes pas habilité à le faire!!`)
      }
    }



    async updateMateriel(idMateriel:string,updateMaterielDto: UpdateMaterielDto,user) {
      const {membreCo,...creation} = updateMaterielDto
    
       
    
          if(user?.roleMembre!==roleMembre.RESP){
            throw new UnauthorizedException()
          }

         
          const matl = await this.getOneMateriel(idMateriel)
          const updateMateriel= await this.materielRepo.preload({
            idMateriel, 
            ...creation,
            // membreCo:
          }
          )

          if(!updateMateriel){
            throw new NotFoundException(`le materiel de Id :${idMateriel} est introuvable`)
        }

    console.log(user.rolePers)
        console.log(updateMateriel.membreCo.rolePers)

      //   if (user.rolePers!==updateMateriel.membreCo.rolePers ) {
      //     throw new UnauthorizedException("ce n'est pas votre materiel!");
      //  }

        return await  this.materielRepo.save(updateMateriel)

    }




    async getOneMateriel(idMateriel){
      return await this.materielRepo.findOneBy({idMateriel})
    }
  
}

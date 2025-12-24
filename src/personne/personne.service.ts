import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonneDto } from './dto/create-personne.dto';
import { Repository } from 'typeorm';
import { personne } from './entities/personne.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MembreCoService } from 'src/membre_co/membre_co.service';

@Injectable()
export class PersonneService {
  
  constructor(
    @InjectRepository(personne)
    private personneRepository: Repository<personne>,

    private membreCoService : MembreCoService
  ){}


  async findOnePersById(
    idpers: string,
  ) {
   const user = await this.personneRepository.findBy({
      idpers
    });
    
    if(!user){
      throw new NotFoundException('utilisateur n`\'existe pas!')
    }


    return user

  }


  async findPersByPhone(phonePers:string){
    const user =this.personneRepository.findOne({where:{phonePers}});
    if(!user){
      throw new NotFoundException('utilisateur n`\'existe pas!')
    }

    return this.membreCoService.findOne(phonePers);

    
  }


  async createPers(persdata:CreatePersonneDto):Promise<personne>{
    // Normalize names to uppercase before saving
    if ((persdata as any).nomPers) (persdata as any).nomPers = (persdata as any).nomPers.toUpperCase();
    if ((persdata as any).pernomPers) (persdata as any).pernomPers = (persdata as any).pernomPers.toUpperCase();

    const pers= this.personneRepository.create(persdata)
   return await this.personneRepository.save(pers)

}

async getAllpersonne(){
  const pers= this.personneRepository.find()
if(!pers){
  throw new NotFoundException('nothing')
}

return pers

}

}

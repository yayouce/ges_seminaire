import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';
import { Niveau } from './entities/niveau.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionEnum } from 'generique/commission.enum';

@Injectable()
export class NiveauService {

  constructor(
    @InjectRepository(Niveau)
    private niveauRepo : Repository<Niveau>
   ){}


  async create(createNiveauDto: CreateNiveauDto,user) {
    const {membreCo,...niveaudata}=createNiveauDto
    if(user?.rolePers!==CommissionEnum.ACCUEIL && user?.rolePers!==CommissionEnum.FORMATION && user?.rolePers!==CommissionEnum.ADMINISTRATION ){
      throw new UnauthorizedException()
    }
    const newNiveau = await this.niveauRepo.create({
      ...niveaudata,
      membreCo:user,
      
    })
    await  this.niveauRepo.save(newNiveau)
  }
  async findOneNiveau(nomNiveau){
    return await this.niveauRepo.findOneBy({nomNiveau})
  }

  async findAllNiveau(){
    return await this.niveauRepo.find()
  }


  async SeminaristesByNiveau(){
   
  
    const currentNiveau=await this.niveauRepo.find()
    const tab=currentNiveau.map((dt:any)=>{

 return{
    niveau:dt.nomNiveau,
    seminaristes:dt.seminariste}
    })

    return tab
  
  
  }
}

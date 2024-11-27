import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';
import { Repository } from 'typeorm';
import { SeminaristeEntity } from './entities/seminariste.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { roleMembre } from 'generique/rolemembre.enum';
import { CommissionEnum } from 'generique/commission.enum';
import { DortoirsService } from 'src/dortoirs/dortoirs.service';
import { UpdateCommissionDto } from 'src/commission/dto/update-commission.dto';

@Injectable()
export class SeminaristeService {
constructor(
  @InjectRepository(SeminaristeEntity)
    
  private seminaristeRepository:Repository <SeminaristeEntity>,
  private dortoirservice : DortoirsService
){}

  async createNewSemi(createSeminaristeDto: CreateSeminaristeDto,user) {
    const {dortoir,genreSemi,membreCo,...seminaristedata}=createSeminaristeDto
    try{
      if(user?.rolePers!==CommissionEnum.ACCUEIL){
        throw new UnauthorizedException()
      }
      
      const founddortoir =await this.dortoirservice.findOneDortoir(dortoir)
 
      if(!founddortoir){
        throw new NotFoundException('dortoir non trouvé!!!')
      }
      if(genreSemi!==founddortoir.genre){
        throw new NotFoundException("le genre du seminariste n\'est pas fait pour ce dortoir")
      }

      const newSeminariste = await this.seminaristeRepository.create({
        ...seminaristedata,
        nomdortoir:founddortoir.nomDortoir,
        membreCo:user,
        dortoir:founddortoir
      })
      await  this.seminaristeRepository.save(newSeminariste)

    }
    catch(err){
      throw new UnauthorizedException(err)
    }
  }


  async updatesemi(idSemi:string,updateseminaristeDto:UpdateSeminaristeDto,user){
    const {dortoir,membreCo,...semi}=updateseminaristeDto

    const founddortoir =await this.dortoirservice.findOneDortoir(dortoir)
 
      if(!founddortoir){
        throw new NotFoundException('dortoir non trouvé!!!')
      }
    const updateSemi= await this.seminaristeRepository.preload(
      {
          idSemi,
          dortoir:founddortoir,
          nomdortoir:founddortoir.nomDortoir,
          membreCo:user,
          ...semi
      }
  );

  if(!updateSemi){
    throw new NotFoundException(`le seminariste de Id :${idSemi} est introuvable`)
}
if(user?.rolePers!==CommissionEnum.ACCUEIL && user?.rolePers!==CommissionEnum.FORMATION){
  throw new UnauthorizedException()
}
console.log(updateSemi)
await  this.seminaristeRepository.save(updateSemi)

  }

  /////////////////////////STAT////////////////////////////////
  
  findAll() {
    return this.seminaristeRepository.find();
  }


  //--------------------Total seminariste par genre-------------------------------//

  async SeminaristeByGender(): Promise<{ genre: string; total: number }[]> {
    const result = await this.seminaristeRepository
      .createQueryBuilder('seminariste')
      .select('seminariste.genreSemi', 'genre')
      .addSelect('COUNT(*)', 'total') 
      .groupBy('seminariste.genreSemi') 
      .getRawMany(); 
  
    const data = result.map(row => ({
      genre: row.genre,
      total: Number(row.total),
    }));
  

    if (!data.find(row => row.genre === 'F')) {
      data.push({ genre: 'F', total: 0 });
    }
  
  
    if (!data.find(row => row.genre === 'M')) {
      data.push({ genre: 'M', total: 0 });
    }
  
    return data;
  }
  



  //---------------------total seminariste par categorie-------------------------------//
  async SeminaristeBycateg(): Promise<{ categorie: string; total: number }[]> {
    const result = await this.seminaristeRepository
      .createQueryBuilder('seminariste')
      .select('seminariste.categorie', 'categorie')
      .addSelect('COUNT(*)', 'total') 
      .groupBy('seminariste.categorie') 
      .getRawMany(); 
  
    return result.map(row => ({
      categorie: row.categorie,
      total: Number(row.total),
    }));
  }




  //------------------------Liste des seminaristes par niveau---------------------------//
  async SeminaristesByNiveau(): Promise<{ niveau: string; seminaristes: SeminaristeEntity[] }[]> {
    const seminaristes = await this.seminaristeRepository.find();
  
    // Grouper les séminaristes par niveau
    const groupedSeminaristes = seminaristes.reduce((acc, seminariste) => {
      const { niveau } = seminariste;
      if (!acc[niveau]) {
        acc[niveau] = [];
      }
      acc[niveau].push(seminariste);
      return acc;
    }, {} as Record <string,SeminaristeEntity[]>);
  
    // Transformer en tableau
    return Object.entries(groupedSeminaristes).map(([niveau, seminaristes]) => ({
      niveau,
      seminaristes,
    }));
  }
  
  
  

  
}

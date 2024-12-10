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
import { NiveauService } from 'src/niveau/niveau.service';

@Injectable()
export class SeminaristeService {
constructor(
  @InjectRepository(SeminaristeEntity)
    
  private seminaristeRepository:Repository <SeminaristeEntity>,
  private dortoirservice : DortoirsService,
  private niveauService:NiveauService
){}

//creation
  async createNewSemi(createSeminaristeDto: CreateSeminaristeDto,user) {
    const {dortoir,genreSemi,membreCo,age,etatSante,niveau,...seminaristedata}=createSeminaristeDto
    try{
      if(user?.rolePers!==CommissionEnum.ACCUEIL){
        throw new UnauthorizedException()
      }
      
      const founddortoir =await this.dortoirservice.findOneDortoir(dortoir)
 
      if(!founddortoir){
        throw new NotFoundException('dortoir non trouvé!!!')
      }
      // const foundniveau =await this.niveauService.findOneNiveau(niveau)
 
      // if(!foundniveau){
      //   throw new NotFoundException('niveau non trouvé!!!')
      // }
      if(genreSemi!==founddortoir.genre){
        throw new NotFoundException("le genre du seminariste n\'est pas fait pour ce dortoir")
      }

      if(age<=6){
        createSeminaristeDto.categorie="Pepinieres"
       
      }
      else if(age>6 && age<=10){
        createSeminaristeDto.categorie="Enfants"
      }
      else{
        createSeminaristeDto.categorie="Jeunes et adultes"
      }

      if(etatSante!=="Malade" && etatSante!=="Autres"){
        createSeminaristeDto.problemeSante="Ras"
      }

      const newSeminariste = await this.seminaristeRepository.create({
        ...seminaristedata,
        // niveau:foundniveau,
        age:createSeminaristeDto.age,
        etatSante:createSeminaristeDto.etatSante,
        problemeSante:createSeminaristeDto.problemeSante,
        categorie:createSeminaristeDto.categorie,
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


  //mise à jour
  async updatesemi(idSemi:string,updateseminaristeDto:UpdateSeminaristeDto,user){
    const {dortoir,membreCo,niveau,...semi}=updateseminaristeDto

    const founddortoir =await this.dortoirservice.findOneDortoir(dortoir)
 
      if(!founddortoir){
        throw new NotFoundException('dortoir non trouvé!!!')
      }


      const foundniveau =await this.niveauService.findOneNiveau(niveau)


 
      if(!foundniveau){
        throw new NotFoundException('dortoir non trouvé!!!')
      }
    const updateSemi= await this.seminaristeRepository.preload(
      {
          idSemi,
          niveau:foundniveau,
          dortoir:founddortoir,
          nomdortoir:founddortoir.nomDortoir,
          membreCo:user,
          ...semi
      }
  );

  if(!updateSemi){
    throw new NotFoundException(`le seminariste de Id :${idSemi} est introuvable`)
}
if(user?.rolePers!==CommissionEnum.ACCUEIL && user?.rolePers!==CommissionEnum.FORMATION ){
  throw new UnauthorizedException()
}
console.log(updateSemi)
await  this.seminaristeRepository.save(updateSemi)

  }


  //suppression
  async deleteSeminariste(idSemi:string,user){
    const seminaristeDelete = await this.seminaristeRepository.findOneBy({idSemi})
    if(!seminaristeDelete){
      throw new NotFoundException("seminariste non trouvé")
    }
    if(user?.rolePers!==CommissionEnum.ACCUEIL){
      throw new UnauthorizedException()
    }
        return await this.seminaristeRepository.softDelete(idSemi)
  
    }



    async findOneById(idParam){
      return await this.seminaristeRepository.findOne({
        where: { idSemi: idParam },
      })
    }


























  /////////////////////////STAT////////////////////////////////
  
  async findAll() {
    return await this.seminaristeRepository.find();
  }


  //--------------------Total seminariste par genre-------------------------------//

  async SeminaristeByGender(): Promise<Record<string, number>> {
    const result = await this.seminaristeRepository
      .createQueryBuilder('seminariste')
      .select('seminariste.genreSemi', 'genre')
      .addSelect('COUNT(*)', 'total')
      .groupBy('seminariste.genreSemi')
      .getRawMany();
  
  
    const data: Record<string, number> = { 
      frere: 0, 
      soeur: 0, 
      non_defini: 0, 
      Total: 0 
    };
  
    result.forEach(row => {
      const genre = row.genre?.toLowerCase() || 'non_defini'; 
      const total = Number(row.total);
  
      if (data.hasOwnProperty(genre)) {
        data[genre] += total;
      }
      data.Total += total; 
    });
  
    return data;
  }


  //par categorie par genre
  async SeminaristeCategByGender(): Promise<Record<string, number>> {
    const result = await this.seminaristeRepository
      .createQueryBuilder('seminariste')
      .select('seminariste.genreSemi', 'genre')
      .addSelect('seminariste.categorie','categorie')
      .addSelect('COUNT(*)', 'total') 
      
      .groupBy('seminariste.genreSemi') 
      .getRawMany(); 
  

    const data: Record<string, number> = { frere: 0, soeur: 0, Total: 0 };
  

    result.forEach(row => {
      const genre = row.genre.toLowerCase();
      const total = Number(row.total);
  
      data[genre] += total;
      data.Total += total;
    });
  
    return data;
  }
  
  



  //---------------------total seminariste par categorie-------------------------------//
  async SeminaristeByCateg(): Promise<any
  // {
  //   categorie: string;
  //   totalFrere: number;
  //   totalSoeur: number;
  // }[]
> {
  const categories = ["Pepinieres", "Enfants", "Jeunes_et_Adultes", "Non_specifie"];
  
  // Exécute la requête groupée par catégorie et genre
  const result = await this.seminaristeRepository
    .createQueryBuilder('seminariste')
    .select('seminariste.categorie', 'categorie')
    .addSelect('seminariste.genreSemi', 'genre')
    .addSelect('COUNT(*)', 'total')
    .groupBy('seminariste.categorie')
    .addGroupBy('seminariste.genreSemi')
    .getRawMany();


  const data: Record<string, { totalFrere: number; totalSoeur: number }> = {};
  
  categories.forEach(category => {
    data[category] = { totalFrere: 0, totalSoeur: 0 };
  });


  result.forEach(row => {
    const categorie = row.categorie;
    const genre = row.genre.toLowerCase();
    const total = Number(row.total);

    if (data[categorie]) {
      if (genre === 'frere') {
        data[categorie].totalFrere += total;
      } else if (genre === 'soeur') {
        data[categorie].totalSoeur += total;
      }
    }
  });


 const dataTab  =  Object.entries(data).map(([categorie, { totalFrere, totalSoeur }]) => ({
    categorie,
    totalFrere,
    totalSoeur,
  }))
  const transformedData = dataTab.reduce((acc, item) => {
    acc[item.categorie] = {
        totalFrere: item.totalFrere,
        totalSoeur: item.totalSoeur
    };
    return acc;
}, {});

  return transformedData;
}








  
  

  
}

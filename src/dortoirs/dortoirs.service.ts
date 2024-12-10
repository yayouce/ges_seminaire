import { BadRequestException, HttpCode, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateDortoirDto } from './dto/create-dortoir.dto';
import { UpdateDortoirDto } from './dto/update-dortoir.dto';
import { Repository } from 'typeorm';
import { dortoirEntity } from './entities/dortoir.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionEnum } from 'generique/commission.enum';
import { MembreCoService } from 'src/membre_co/membre_co.service';
import { SeminaristeEntity } from 'src/seminariste/entities/seminariste.entity';
import { SeminaristeService } from 'src/seminariste/seminariste.service';

@Injectable()
export class DortoirsService {

constructor(
  @InjectRepository(dortoirEntity)
private dortoirRepository:Repository <dortoirEntity>,


){}
  async createDortoir(createDortoirDto: CreateDortoirDto,user) {
  const {membreCo,...creation} = createDortoirDto

    try{

      if(user?.rolePers!==CommissionEnum.ACCUEIL){
        throw new UnauthorizedException()
      }
     
      const newdortoir= this.dortoirRepository.create({

        ...creation,
        membreCo : user
      }
      )
     this.dortoirRepository.save(newdortoir)
    }
    catch(err){
      throw new UnauthorizedException(`vous n'êtes pas habilité à le faire!!`)
    }
  }


  async findOneDortoir(nomDortoir){
   const dortoir= this.dortoirRepository.findOne({where:{nomDortoir:nomDortoir}})

    return dortoir
    }

   

    async findDortoirListe(){
      return this.dortoirRepository.find()
    }


    // async ajouterSeminariste(dortoirId: string, seminaristeId: string): Promise<dortoirEntity> {
    //   // Trouver le dortoir
    //   const dortoir = await this.dortoirRepository.findOne({
    //     where: { idDortoir: dortoirId },
    //     relations: ['seminaristes'],
    //   });
  
    //   if (!dortoir) {
    //     throw new NotFoundException(`Dortoir avec l'id ${dortoirId} non trouvé.`);
    //   }
  
    //   // Trouver le séminariste
    //   const seminariste = await this.seminaristeRepository.findOne({
    //     where: { idSemi: seminaristeId },
    //   });
  
    //   if (!seminariste) {
    //     throw new NotFoundException(`Séminariste avec l'id ${seminaristeId} non trouvé.`);
    //   }
  
    //   // Vérifier s'il reste des places dans le dortoir
    //   if (dortoir.seminaristes.length >= dortoir.nbPlace) {
    //     throw new BadRequestException('Le dortoir est plein.');
    //   }
  
    //   // Vérifier la compatibilité du genre
    //   if (dortoir.genre !== seminariste.genreSemi) {
    //     throw new BadRequestException(
    //       `Le genre du séminariste (${seminariste.genreSemi}) ne correspond pas au genre du dortoir (${dortoir.genre}).`,
    //     );
    //   }
  
    //   // Ajouter le séminariste au dortoir
    //   seminariste.dortoir = dortoir;
    //   await this.seminaristeRepository.save(seminariste);
  
    //   // Retourner le dortoir mis à jour
    //   return await this.dortoirRepository.findOne({
    //     where: { idDortoir: dortoirId },
    //     relations: ['seminaristes'],
    //   });
    // }






    




    //_____________________STAT_____________________________
    async totalDortoirByType() {
      const result = await this.dortoirRepository
          .createQueryBuilder('dortoir')
          .select('dortoir.typedortoir', 'typedortoir')
          .addSelect('COUNT(*)', 'total')
          .groupBy('dortoir.typedortoir')
          .getRawMany();
  
      const consolidatedData: Record<string, number> = {
          seminariste: 0,
          co: 0,
          non_defini: 0
      };
  
      
      result.forEach(row => {
          const typedortoir = row.typedortoir.toLowerCase();
          consolidatedData[typedortoir] = Number(row.total);
      });
  
      return consolidatedData;
  }


  async totalDortoirByGenre() {
    const result = await this.dortoirRepository
        .createQueryBuilder('dortoir')
        .select('dortoir.genre', 'genre')
        .addSelect('COUNT(*)', 'total')
        .groupBy('dortoir.genre')
        .getRawMany();

    const consolidatedData: Record<string, number> = {
        pepiniere:0,
        frere: 0,
        soeur: 0,
        non_defini: 0
    };

    
    result.forEach(row => {
        const genre = row.genre.toLowerCase();
        consolidatedData[genre] = Number(row.total);
    });

    return consolidatedData;
}

  

       




   


  findAll() {
    return this.dortoirRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} dortoir`;
  }

  update(id: number, updateDortoirDto: UpdateDortoirDto) {
    return `This action updates a #${id} dortoir`;
  }

  remove(id: number) {
    return `This action removes a #${id} dortoir`;
  }
}

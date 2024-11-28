import { HttpCode, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateDortoirDto } from './dto/create-dortoir.dto';
import { UpdateDortoirDto } from './dto/update-dortoir.dto';
import { Repository } from 'typeorm';
import { dortoirEntity } from './entities/dortoir.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionEnum } from 'generique/commission.enum';
import { MembreCoService } from 'src/membre_co/membre_co.service';

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
  


  //     const result = await this.dortoirRepository
  //     .createQueryBuilder('dortoir')
  //     .select('dortoir.typedortoir', 'typedortoir')
  //     .addSelect('COUNT(*)', 'total') 
  //     .groupBy('dortoir.typedortoir') 
  //     .getRawMany(); 
  
  //  const resultat= result.map(row => ({
  //     [row.typedortoir]: Number(row.total)
   
  //   }))

  //   return resultat
  
  //   ;

       




   


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

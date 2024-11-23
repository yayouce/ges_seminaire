import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { Repository } from 'typeorm';
import { CommissionEntity } from './entities/commission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';

@Injectable()
export class CommissionService {

constructor(
  @InjectRepository(CommissionEntity)
  private commissionRepository:Repository<CommissionEntity>,
 
){}

async findOne(membrecomi){

  const commission = await this.commissionRepository.findOne({
    where:{libelleComi: membrecomi},
  });

  return commission
}

  async createCommision(createCommission: CreateCommissionDto) {


   try{
     return await this.commissionRepository.save(createCommission)
    
    }
   catch(err){
    throw new ConflictException("la commission existe dejà!")
   }

  }

  //ajout de membre co dans la commission
  // async AjoutMembreCo(membrecomi){
  //   const {motPass,...object}=membrecomi


  //   const commission = await this.commissionRepository.findOne({
  //     where:{libelleComi: object},
  //   });

  //   await commission.membres.push(membrecomi)
  
  //   return commission
  // }


  async findByLibelle(libell){
return await this.commissionRepository.findOneBy(libell)
  }

  async findAllComi(){
    return await this.commissionRepository.find()
  }

  
}

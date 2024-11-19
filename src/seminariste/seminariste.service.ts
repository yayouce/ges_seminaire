import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';
import { Repository } from 'typeorm';
import { SeminaristeEntity } from './entities/seminariste.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { roleMembre } from 'generique/rolemembre.enum';
import { CommissionEnum } from 'generique/commission.enum';

@Injectable()
export class SeminaristeService {
constructor(
  @InjectRepository(SeminaristeEntity)
    
  private seminaristeRepository:Repository <SeminaristeEntity>
){}

  async createNewSemi(createSeminaristeDto: CreateSeminaristeDto,user) {
    try{
      if(user?.rolePers!==CommissionEnum.ACCUEIL){
        throw new UnauthorizedException()
      }
      return this.seminaristeRepository.save(createSeminaristeDto)  ;
    }
    catch(err){
      throw new UnauthorizedException("être de la commission Accueil_Hébergement")
    }
  }

  findAll() {
    return `This action returns all seminariste`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seminariste`;
  }

  update(id: number, updateSeminaristeDto: UpdateSeminaristeDto) {
    return `This action updates a #${id} seminariste`;
  }

  remove(id: number) {
    return `This action removes a #${id} seminariste`;
  }
}

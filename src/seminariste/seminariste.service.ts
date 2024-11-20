import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';
import { Repository } from 'typeorm';
import { SeminaristeEntity } from './entities/seminariste.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { roleMembre } from 'generique/rolemembre.enum';
import { CommissionEnum } from 'generique/commission.enum';
import { DortoirsService } from 'src/dortoirs/dortoirs.service';

@Injectable()
export class SeminaristeService {
constructor(
  @InjectRepository(SeminaristeEntity)
    
  private seminaristeRepository:Repository <SeminaristeEntity>,
  private dortoirservice : DortoirsService
){}

  async createNewSemi(createSeminaristeDto: CreateSeminaristeDto,user) {
    const {dortoir,membreCo,...seminaristedata}=createSeminaristeDto
    try{
      if(user?.rolePers!==CommissionEnum.ACCUEIL){
        throw new UnauthorizedException()
      }
      
      const founddortoir =await this.dortoirservice.findOneDortoir(dortoir)
 
      if(!founddortoir){
        throw new NotFoundException('dortoir non trouvé!!!')
      }

      

      const newSeminariste = await this.seminaristeRepository.create({
        ...seminaristedata,
        membreCo:user,
        dortoir:founddortoir
      })
      await  this.seminaristeRepository.save(newSeminariste)

    }
    catch(err){
      throw new UnauthorizedException(err)
    }
  }

  findAll() {
    return this.seminaristeRepository.find();
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

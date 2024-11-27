import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MembreCoEntity } from './entities/membre_co.entity';
import { Repository } from 'typeorm';
import { CommissionEntity } from 'src/commission/entities/commission.entity';
import { CommissionService } from 'src/commission/commission.service';
import * as bcrypt from "bcrypt"
import { responsabilite } from 'generique/responsabilite.enum';
import { roleMembre } from 'generique/rolemembre.enum';

const saltOrRounds = 10
@Injectable()
export class MembreCoService {
  constructor(
    @InjectRepository(MembreCoEntity)
    private membreRepository : Repository<MembreCoEntity>,
    private commissionService:CommissionService
 
)
{}


async findOne(phone){
 return await this.membreRepository.findOne({
  where: { phonePers: phone },
})
}



async createMembreCo(createmembreco:CreateMembreCoDto,user){

  if(user?.roleMembre!==roleMembre.RESP){
  throw new UnauthorizedException()
}
  const commission = await this.commissionService.findOne(createmembreco.commission);

  if(!commission){
    throw new NotFoundException("commission non trouvé ")
  }
  if(user.rolePers!==createmembreco.rolePers){
    throw new NotFoundException("N'\est pas de votre commission!")
  }
  
  const hashedpassword =await  bcrypt.hash(createmembreco.motPass,saltOrRounds)
  
  const membreCo=this.membreRepository.create({
    ...createmembreco,
    motPass:hashedpassword,
    commission
  })
return this.membreRepository.save(membreCo) 
}


async membreCoByGender(): Promise<{ genre: string; total: number }[]> {
  const result = await this.membreRepository
    .createQueryBuilder('membreco')
    .select('membreco.genrePers', 'genre')
    .addSelect('COUNT(*)', 'total') 
    .groupBy('membreco.genrePers') 
    .getRawMany(); 

  return result.map(row => ({
    genre: row.genre,
    total: Number(row.total),
  }));
}

  
}

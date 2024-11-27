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






//___________________________STAT____________________________________


async membreCoByGender(): Promise<Record<string, Record<string, number>>> {
  const result = await this.membreRepository
    .createQueryBuilder('membreco')
    .select('membreco.genrePers', 'genre')
    .addSelect('membreco.rolePers', 'commission')
    .addSelect('COUNT(*)', 'total') 
    .groupBy('membreco.rolePers')
    .addGroupBy('membreco.genrePers')
    .getRawMany(); 


  const groupedData: Record<string, Record<string, number>> = {};

  result.forEach(row => {
    const commission = row.commission;
    const genre = row.genre.toLowerCase();
    const total = Number(row.total);

    if (!groupedData[commission]) {
      groupedData[commission] = { frère: 0, soeur: 0, Total: 0 };
    }

    groupedData[commission][genre] = total;
    groupedData[commission].Total += total; 
  });


  Object.keys(groupedData).forEach(commission => {
    if (!groupedData[commission].frère) {
      groupedData[commission].frère = 0;
    }
    if (!groupedData[commission].soeur) {
      groupedData[commission].soeur = 0;
    }
  });

  return groupedData;
}


  
}

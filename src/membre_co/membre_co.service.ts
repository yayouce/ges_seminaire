import { Injectable } from '@nestjs/common';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MembreCoEntity } from './entities/membre_co.entity';
import { Repository } from 'typeorm';
import { CommissionEntity } from 'src/commission/entities/commission.entity';
import { CommissionService } from 'src/commission/commission.service';
import * as bcrypt from "bcrypt"

const saltOrRounds = 10
@Injectable()
export class MembreCoService {
  constructor(
    @InjectRepository(MembreCoEntity)
    private membreRepository : Repository<MembreCoEntity>,
    private commissionService:CommissionService
 
)
{}



async createMembreCo(createmembreco:CreateMembreCoDto){

  const commission = await this.commissionService.findOne(createmembreco.commission);

  if(!commission){
    throw new Error("commission non trouvé")
  }

  const hashedpassword =await  bcrypt.hash(createmembreco.motPass,saltOrRounds)

  const membreCo=this.membreRepository.create({
    ...createmembreco,
    motPass:hashedpassword,
    commission
  })

return this.membreRepository.save(membreCo)
}

  
}

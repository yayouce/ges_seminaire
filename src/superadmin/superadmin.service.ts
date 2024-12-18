import { Injectable } from '@nestjs/common';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { Repository } from 'typeorm';
import { Superadmin } from './entities/superadmin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from "bcrypt"

const saltOrRounds=10
@Injectable()
export class SuperadminService {

constructor(
  @InjectRepository(Superadmin)
  private superAdminRepo  : Repository<Superadmin>){
  
}

  async create(superadminDto: CreateSuperadminDto) {
    const hashedpassword =await  bcrypt.hash(superadminDto.motPassSupAdmin,saltOrRounds)
  
    const superadmin=this.superAdminRepo.create({
      ...superadminDto,
      motPassSupAdmin:hashedpassword,
    })
  
  
  return this.superAdminRepo.save(superadmin) 

  }


  

  
}

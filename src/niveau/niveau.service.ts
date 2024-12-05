import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Niveau } from './entities/niveau.entity';
import { Repository } from 'typeorm';
import { roleMembre } from 'generique/rolemembre.enum';

@Injectable()
export class NiveauService {
  constructor(
    @InjectRepository(Niveau)
    private niveauRepo : Repository<Niveau>,
)
{}
 async create(createNiveauDto: CreateNiveauDto,user) {
  if(user?.roleMembre!==roleMembre.RESP){
    throw new UnauthorizedException()
  }
  const niveau = this.niveauRepo.create(createNiveauDto);
   return await this.niveauRepo.save(niveau) ;
}

  findAll() {
    return `This action returns all niveau`;
  }

  findOne(id: number) {
    return `This action returns a #${id} niveau`;
  }

  update(id: number, updateNiveauDto: UpdateNiveauDto) {
    return `This action updates a #${id} niveau`;
  }

  remove(id: number) {
    return `This action removes a #${id} niveau`;
  }
}

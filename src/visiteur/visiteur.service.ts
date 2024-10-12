import { Injectable } from '@nestjs/common';
import { CreateVisiteurDto } from './dto/create-visiteur.dto';
import { UpdateVisiteurDto } from './dto/update-visiteur.dto';

@Injectable()
export class VisiteurService {
  create(createVisiteurDto: CreateVisiteurDto) {
    return 'This action adds a new visiteur';
  }

  findAll() {
    return `This action returns all visiteur`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visiteur`;
  }

  update(id: number, updateVisiteurDto: UpdateVisiteurDto) {
    return `This action updates a #${id} visiteur`;
  }

  remove(id: number) {
    return `This action removes a #${id} visiteur`;
  }
}

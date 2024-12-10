import { Injectable } from '@nestjs/common';
import { CreateCaisseDto } from './dto/create-caisse.dto';
import { UpdateCaisseDto } from './dto/update-caisse.dto';

@Injectable()
export class CaisseService {
  create(createCaisseDto: CreateCaisseDto) {
    return 'This action adds a new caisse';
  }

  findAll() {
    return `This action returns all caisse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} caisse`;
  }

  update(id: number, updateCaisseDto: UpdateCaisseDto) {
    return `This action updates a #${id} caisse`;
  }

  remove(id: number) {
    return `This action removes a #${id} caisse`;
  }
}

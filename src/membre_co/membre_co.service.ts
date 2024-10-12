import { Injectable } from '@nestjs/common';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';

@Injectable()
export class MembreCoService {
  create(createMembreCoDto: CreateMembreCoDto) {
    return 'This action adds a new membreCo';
  }

  findAll() {
    return `This action returns all membreCo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membreCo`;
  }

  update(id: number, updateMembreCoDto: UpdateMembreCoDto) {
    return `This action updates a #${id} membreCo`;
  }

  remove(id: number) {
    return `This action removes a #${id} membreCo`;
  }
}

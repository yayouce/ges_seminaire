import { Injectable } from '@nestjs/common';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';

@Injectable()
export class SeminaristeService {
  create(createSeminaristeDto: CreateSeminaristeDto) {
    return 'This action adds a new seminariste';
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

import { Injectable } from '@nestjs/common';
import { CreateDortoirDto } from './dto/create-dortoir.dto';
import { UpdateDortoirDto } from './dto/update-dortoir.dto';

@Injectable()
export class DortoirsService {
  create(createDortoirDto: CreateDortoirDto) {
    return 'This action adds a new dortoir';
  }

  findAll() {
    return `This action returns all dortoirs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dortoir`;
  }

  update(id: number, updateDortoirDto: UpdateDortoirDto) {
    return `This action updates a #${id} dortoir`;
  }

  remove(id: number) {
    return `This action removes a #${id} dortoir`;
  }
}

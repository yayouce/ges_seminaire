import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DortoirsService } from './dortoirs.service';
import { CreateDortoirDto } from './dto/create-dortoir.dto';
import { UpdateDortoirDto } from './dto/update-dortoir.dto';

@Controller('dortoirs')
export class DortoirsController {
  constructor(private readonly dortoirsService: DortoirsService) {}

  @Post()
  create(@Body() createDortoirDto: CreateDortoirDto) {
    return this.dortoirsService.create(createDortoirDto);
  }

  @Get()
  findAll() {
    return this.dortoirsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dortoirsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDortoirDto: UpdateDortoirDto) {
    return this.dortoirsService.update(+id, updateDortoirDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dortoirsService.remove(+id);
  }
}

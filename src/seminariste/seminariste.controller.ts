import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeminaristeService } from './seminariste.service';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';

@Controller('seminariste')
export class SeminaristeController {
  constructor(private readonly seminaristeService: SeminaristeService) {}

  @Post()
  create(@Body() createSeminaristeDto: CreateSeminaristeDto) {
    return this.seminaristeService.create(createSeminaristeDto);
  }

  @Get()
  findAll() {
    return this.seminaristeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seminaristeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeminaristeDto: UpdateSeminaristeDto) {
    return this.seminaristeService.update(+id, updateSeminaristeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seminaristeService.remove(+id);
  }
}

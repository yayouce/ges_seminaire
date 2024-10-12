import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembreCoService } from './membre_co.service';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';

@Controller('membre-co')
export class MembreCoController {
  constructor(private readonly membreCoService: MembreCoService) {}

  @Post()
  create(@Body() createMembreCoDto: CreateMembreCoDto) {
    return this.membreCoService.create(createMembreCoDto);
  }

  @Get()
  findAll() {
    return this.membreCoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membreCoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMembreCoDto: UpdateMembreCoDto) {
    return this.membreCoService.update(+id, updateMembreCoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membreCoService.remove(+id);
  }
}

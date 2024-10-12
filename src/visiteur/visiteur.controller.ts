import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VisiteurService } from './visiteur.service';
import { CreateVisiteurDto } from './dto/create-visiteur.dto';
import { UpdateVisiteurDto } from './dto/update-visiteur.dto';

@Controller('visiteur')
export class VisiteurController {
  constructor(private readonly visiteurService: VisiteurService) {}

  @Post()
  create(@Body() createVisiteurDto: CreateVisiteurDto) {
    return this.visiteurService.create(createVisiteurDto);
  }

  @Get()
  findAll() {
    return this.visiteurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visiteurService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisiteurDto: UpdateVisiteurDto) {
    return this.visiteurService.update(+id, updateVisiteurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visiteurService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NiveauService } from './niveau.service';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('niveau')
export class NiveauController {
  constructor(private readonly niveauService: NiveauService) {}


  @UseGuards(JwtAuthGuard)
  @Post("add")
  create(
    @Body() createNiveauDto: CreateNiveauDto,
    @User() user
    
  ) {
  return this.niveauService.create(createNiveauDto,user);
 }

  @Get()
  findAll() {
    return this.niveauService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.niveauService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNiveauDto: UpdateNiveauDto) {
    return this.niveauService.update(+id, updateNiveauDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.niveauService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MembreCoService } from './membre_co.service';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';

@Controller('membre-co')
export class MembreCoController {
  constructor(private readonly membreCoService: MembreCoService) {}




  

  @Post("add")
  create(@Body() createmembreCo: CreateMembreCoDto) {
    return this.membreCoService.createMembreCo(createmembreCo);
  }

}

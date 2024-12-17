import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DortoirsService } from './dortoirs.service';
import { CreateDortoirDto } from './dto/create-dortoir.dto';
import { UpdateDortoirDto } from './dto/update-dortoir.dto';
import { User } from 'src/decorator/user.decorator';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { dortoirEntity } from './entities/dortoir.entity';

@Controller('dortoirs')
export class DortoirsController {

  
  constructor(
    
    private readonly dortoirsService: DortoirsService)

    
    {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  create(
    @Body() createDortoirDto: CreateDortoirDto,
    @User() user
  ) {
    return this.dortoirsService.createDortoir(createDortoirDto,user);
  }


 

  @Get()
  findAll() {
    return this.dortoirsService.findAll();
  }







//________________________________STAT____________________________

@Get('totaldortoirBytype')
async totalDortoirByType() {
  return await this.dortoirsService.totalDortoirByType()
}


@Get('totaldortoirByGenre')
async totalDortoirByGenre() {
  return await this.dortoirsService.totalDortoirByGenre()
}


@Get("listeDortoir")
async findDortoirListe(){
  return this.dortoirsService.findDortoirListe()
}











  
}

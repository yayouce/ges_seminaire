import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MembreCoService } from './membre_co.service';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

import { RolesGuard } from 'src/Auth/Guard&decorators/roleGuard';
import { User } from 'src/decorator/user.decorator';



@Controller('membre-co')

export class MembreCoController {
  constructor(private readonly membreCoService: MembreCoService) {}




  

  

  
  @UseGuards(JwtAuthGuard)
  @Post("add")
  create(
    
    @Body() createmembreCo: CreateMembreCoDto,
    @User() user
  ) {
    return this.membreCoService.createMembreCo(createmembreCo,user);
  }

@Get('liste')
async membreCoParcomi(){
  return await this.membreCoService.membreCoParcomi()
}


@Get("membres")
async getmembreco(){
  return await this.membreCoService.getmembreco()
}


  @Get("totalByGender")
  async membreCoByGender(){
    return await this.membreCoService.membreCoByGender()
  }

  @Get("totalFormateur")
  async TotalformateurCo(){
    return await this.membreCoService.findTotalByGenderFormateur()
  }

}

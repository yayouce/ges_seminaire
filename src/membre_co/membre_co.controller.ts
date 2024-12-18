import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MembreCoService } from './membre_co.service';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

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

// @Get('liste')
// async membreCoParcomi(){
//   return await this.membreCoService.membreCoParcomi()
// }

@Get("membres")
async getmembreco(){
  return await this.membreCoService.getmembreco()
}

@Get("getPco")
async getPco(){
  return await this.membreCoService.getPco()
}

@Get("getPcobyid/:id")
async getPcoById(
  @Param('id') id:string
){
  return await this.membreCoService.getPcobyId(id)
}




@Get("TotalGender")
async membreCoTotalByGender(){
  return await this.membreCoService.membreCoTotalByGender()
}


  @Get("totalByGender")
  async membreCoByGender(){
    return await this.membreCoService.membreCoByGender()
  }

  @Get("totalFormateur")
  async TotalformateurCo(){
    return await this.membreCoService.findTotalByGenderFormateur()
  }










  @Patch("update/:id")
  @UseGuards(JwtAuthGuard)
  async updateSemi(
    @User() user,
    @Param("id") id:string,
    @Body() updateMembre :UpdateMembreCoDto
  ){

    return await this.membreCoService.updateMembre(id,updateMembre,user)
  }


  
  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteMembreCo(
    @User() user,
    @Param('id') id:string
  ){
    return await this.membreCoService.deleteMembreCo(id,user)
  }

}

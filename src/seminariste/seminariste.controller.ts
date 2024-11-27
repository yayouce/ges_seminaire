import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SeminaristeService } from './seminariste.service';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { RolesGuard } from 'src/Auth/Guard&decorators/roleGuard';
import { User } from 'src/decorator/user.decorator';
import { UpdateCommissionDto } from 'src/commission/dto/update-commission.dto';

@Controller('seminariste')
export class SeminaristeController {
  constructor(private readonly seminaristeService: SeminaristeService) {}

  @Post('add')
 
  @UseGuards(JwtAuthGuard)
  create(
    @User() user,
    @Body() createSeminaristeDto: CreateSeminaristeDto) {
    return this.seminaristeService.createNewSemi(createSeminaristeDto,user);
  }

  @Get()
  findAll() {
    return this.seminaristeService.findAll();
  }

//--------------------------------stat

@Get("totalByGender")
async SeminaristeByGender(){
  return await this.seminaristeService.SeminaristeByGender()
}

@Get("totalByCateg")
async SeminaristeBycateg(){
  return this.seminaristeService.SeminaristeBycateg()
}


@Get("totalByniveau")
async SeminaristesByNiveau(){
  return this.seminaristeService.SeminaristesByNiveau()
}







  @Patch("update/:id")
  @UseGuards(JwtAuthGuard)
  async updateSemi(
    @User() user,
    @Param("id") id:string,
    @Body() updateSemi :UpdateSeminaristeDto
  ){

    return await this.seminaristeService.updatesemi(id,updateSemi,user)
  }

}

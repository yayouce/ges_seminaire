import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaterielService } from './materiel.service';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('materiel')
export class MaterielController {
  constructor(private readonly materielService: MaterielService) {}


  @UseGuards(JwtAuthGuard)
  @Post('add')
  async creationRapport(
    @User() user,
    @Body() materiel:CreateMaterielDto
  ){

    return this.materielService.createMateriel(materiel,user)
  }



  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async updateMateriel(
    @User() user,
    @Param('id') id:string,
    @Body() materiel:CreateMaterielDto
  ){

    return this.materielService.updateMateriel(id,materiel,user)
  }




  @UseGuards(JwtAuthGuard)
  @Delete('getAll')
  async getMateriel(
    @User() user,
    @Param('id') id:string,

  ){

    return this.materielService.deleteMateriel(id,user)
  }



  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteMateriel(
    @User() user,
    @Param('id') id:string,

  ){

    return this.materielService.deleteMateriel(id,user)
  }
  


  
}

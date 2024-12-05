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
  async create(
    @Body() createNiveauDto: CreateNiveauDto,
    @User() user,

  ) {
    return await this.niveauService.create(createNiveauDto,user);
  }


  @Get('all')
  async findAllNiveau(){
return await this.niveauService.findAllNiveau()
  }


  @Get('seminaristeByNiveau')
  async SeminaristesByNiveau(){
    return await this.niveauService.SeminaristesByNiveau()
  }
  
}

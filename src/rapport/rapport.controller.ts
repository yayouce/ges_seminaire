import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RapportService } from './rapport.service';
import { CreateRapportDto } from './dto/create-rapport.dto';
import { UpdateRapportDto } from './dto/update-rapport.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('rapport')
export class RapportController {
  constructor(private readonly rapportService: RapportService) {}



  @UseGuards(JwtAuthGuard)
  @Post('add')
  async creationRapport(
    @User() user,
    @Body() rapport:CreateRapportDto
  ){

    return this.rapportService.creationRapport(rapport,user)
  }
 
}

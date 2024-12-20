import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { RapportService } from './rapport.service';
import { CreateRapportDto } from './dto/create-rapport.dto';
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

@UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getAllFor(
    @User() user,
  ){

    return this.rapportService.getAll(user)
  }


   @Get('getoneRapport/:id')
    async getById(
      @Param('id') id:string
    ) {
  
      return await this.rapportService.getById(id)
    }



  



 
}

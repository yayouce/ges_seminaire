import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpException } from '@nestjs/common';
import { VisiteurService } from './visiteur.service';
import { CreateVisiteurDto } from './dto/create-visiteur.dto';
import { UpdateVisiteurDto } from './dto/update-visiteur.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';

@Controller('visiteur')
export class VisiteurController {
  constructor(private readonly visiteurService: VisiteurService) {}

  @Post('add')
 
  @UseGuards(JwtAuthGuard)
  create(
    @User() user,
    @Body() CreateVisiteurDto: CreateVisiteurDto) {
    return this.visiteurService.createNewVisiteur(CreateVisiteurDto,user);
  }

  @Get("visites/encours")
  findAll() {
    return this.visiteurService.findAll();
  }

  @Get("visites/termine")
  findSoftDeletedVisiteurs(){
    return this.visiteurService.findSoftDeletedVisiteurs()
  }



@Get('totalByday')
async VisiteTotalParJour(){
  return this.visiteurService.VisiteTotalParJour()
}




@Get('totalByJourParGenre')
async getVisiteTotalParJourParGenre(
  @Query('date') date: string,
): Promise<{ date: string; totalVisites: number; genreVisiteur: Record<string, number> }> {
  if (!date || isNaN(Date.parse(date))) {
    throw new HttpException( {
      statusCode:801,
      error:"commission non trouvé"
    },
  801);
  }

  return this.visiteurService.VisiteTotalParJourParGenre(date);
}


@Get('totalByGenre')
async getVisiteTotalParGenre(): Promise<{ 
  totalVisites: number; 
  genreVisiteur: Record<string, number>; 
}> {
  return this.visiteurService.VisiteTotalParGenre();
}


  


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
   async deleteCv(
      @User() user,
      @Param('id') id:string
  )
  {
  return await this.visiteurService.deleteVisiteur(id,user);
  }
}

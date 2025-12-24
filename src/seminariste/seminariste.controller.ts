import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SeminaristeService } from './seminariste.service';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';
import { User } from 'src/decorator/user.decorator';

@ApiTags('Séminaristes')
@Controller('seminariste')
export class SeminaristeController {
  constructor(private readonly seminaristeService: SeminaristeService) {}

  @Post('add')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Créer un nouveau séminariste',
    description: 'Permet de créer un nouveau séminariste. Accessible aux membres de la commission Accueil et aux superadmins. Le matricule sera automatiquement formaté (ex: 20 → IKH-0020). Vérifie qu\'aucun séminariste avec le même matricule ou les mêmes informations (nom, prénom, téléphone) n\'existe déjà.'
  })
  @ApiResponse({
    status: 201,
    description: 'Séminariste créé avec succès',
  })
  @ApiResponse({ status: 701, description: 'Accès refusé : permissions insuffisantes' })
  @ApiResponse({ status: 702, description: 'Dortoir non trouvé' })
  @ApiResponse({ status: 703, description: 'Le genre du séminariste ne correspond pas au dortoir' })
  @ApiResponse({ status: 709, description: 'Un séminariste avec ce matricule existe déjà' })
  @ApiResponse({ status: 710, description: 'Cette personne est déjà enregistrée comme séminariste' })
  create(
    @User() user,
    @Body() createSeminaristeDto: CreateSeminaristeDto) {
    return this.seminaristeService.createNewSemi(createSeminaristeDto,user);
  }

  @Get("listeSeminariste")
  @ApiOperation({
    summary: 'Récupérer tous les séminaristes',
    description: 'Retourne la liste complète de tous les séminaristes enregistrés'
  })
  @ApiResponse({ status: 200, description: 'Liste des séminaristes récupérée avec succès' })
  async findAll() {
    return await this.seminaristeService.findAll();
  }





//--------------------------------stat

@Get("totalByGender")
@ApiOperation({
  summary: 'Statistiques des séminaristes par genre',
  description: 'Retourne le nombre de séminaristes groupés par genre (frère/soeur) avec le total'
})
@ApiResponse({
  status: 200,
  description: 'Statistiques récupérées',
  schema: {
    example: {
      frere: 150,
      soeur: 120,
      non_defini: 0,
      Total: 270
    }
  }
})
async SeminaristeByGender(){
  return await this.seminaristeService.SeminaristeByGender()
}

@Get("totalByCateg")
@ApiOperation({
  summary: 'Statistiques des séminaristes par catégorie',
  description: 'Retourne le nombre de séminaristes groupés par catégorie (Pépinières, Enfants, Jeunes et Adultes) avec distinction par genre'
})
@ApiResponse({
  status: 200,
  description: 'Statistiques par catégorie récupérées',
  schema: {
    example: {
      Pepinieres: { totalFrere: 20, totalSoeur: 18 },
      Enfants: { totalFrere: 45, totalSoeur: 40 },
      Jeunes_et_Adultes: { totalFrere: 85, totalSoeur: 62 }
    }
  }
})
async SeminaristeBycateg(){
  return this.seminaristeService.SeminaristeByCateg()
}


// @Get("seminaristeByniveau")
// async SeminaristesByNiveau(){
//   return this.seminaristeService.SeminaristesByNiveau()
// }









  @Patch("update/:id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Modifier un séminariste',
    description: 'Permet de modifier les informations d\'un séminariste. Accessible aux membres des commissions Accueil, Administration, Formation et aux superadmins.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID du séminariste à modifier',
    example: 'uuid-seminariste'
  })
  @ApiResponse({ status: 200, description: 'Séminariste modifié avec succès' })
  @ApiResponse({ status: 701, description: 'Accès refusé : permissions insuffisantes' })
  @ApiResponse({ status: 705, description: 'Séminariste non trouvé' })
  async updateSemi(
    @User() user,
    @Param("id") id:string,
    @Body() updateSemi :UpdateSeminaristeDto
  ){

    return await this.seminaristeService.updatesemi(id,updateSemi,user)
  }





@Get('getone/:id')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiOperation({
  summary: 'Récupérer un séminariste par son ID',
  description: 'Retourne les informations détaillées d\'un séminariste spécifique avec ses relations (dortoir, niveau, membre CO)'
})
@ApiParam({
  name: 'id',
  description: 'ID du séminariste',
  example: 'uuid-seminariste'
})
@ApiResponse({ status: 200, description: 'Séminariste trouvé' })
@ApiResponse({ status: 706, description: 'Séminariste non trouvé' })
async findOneById(@Param('id') id:string){

return this.seminaristeService.findOneById(id)
}


  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Supprimer un séminariste (soft delete)',
    description: 'Effectue une suppression logique d\'un séminariste. Accessible aux membres des commissions Accueil, Administration, Formation et aux superadmins.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID du séminariste à supprimer',
    example: 'uuid-seminariste'
  })
  @ApiResponse({ status: 200, description: 'Séminariste supprimé avec succès' })
  @ApiResponse({ status: 701, description: 'Accès refusé : permissions insuffisantes' })
  @ApiResponse({ status: 706, description: 'Séminariste non trouvé' })
  async deleteSeminariste(
    @User() user,
    @Param('id') id:string
  ){
    return await this.seminaristeService.deleteSeminariste(id,user)
  }

}

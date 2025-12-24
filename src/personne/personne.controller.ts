import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { PersonneService } from './personne.service';
import { MembreCoService } from 'src/membre_co/membre_co.service';
import { SeminaristeService } from 'src/seminariste/seminariste.service';

@Controller('personne')
export class PersonneController {
  constructor(
    private readonly personneService: PersonneService,
    private readonly membreCoService: MembreCoService,
    private readonly seminaristeService: SeminaristeService,
  ) {}

  // Badge: returns nom, prenom and dortoir (for seminariste) or commission (for membreco)
  @Get('badge/:id')
  async badgeById(@Param('id') id: string) {
    // Try find as MembreCo (idpers)
    const membre = await this.membreCoService.findOneById(id);
    if (membre) {
      return {
        nom: membre.nomPers,
        prenom: membre.pernomPers,
        commission: membre.commission?.libelleComi || null,
      };
    }

    // Try find as Seminariste (id could be idSemi)
    try {
      const semi = await this.seminaristeService.findOneById(id);
      if (semi) {
        return {
          nom: semi.nomSemi,
          prenom: semi.prenomSemi,
          dortoir: semi.nomdortoir || (semi.dortoir && semi.dortoir.nomDortoir) || null,
        };
      }
    } catch (err) {
      // ignore not found
    }

    // Try find generic personne
    const persArr = await this.personneService.findOnePersById(id);
    const pers = Array.isArray(persArr) ? persArr[0] : persArr;
    if (pers) {
      return {
        nom: pers.nomPers,
        prenom: pers.pernomPers,
      };
    }

    throw new NotFoundException('Utilisateur non trouvé');
  }

  @Post('badge')
  async badgesByIds(@Body('ids') ids: string[]) {
    if (!Array.isArray(ids)) throw new BadRequestException('Expected body { ids: string[] }');
    const results = await Promise.all(ids.map(async (id) => {
      try {
        const data = await this.badgeById(id);
        return { id, data };
      } catch (err) {
        return { id, error: 'Utilisateur non trouvé' };
      }
    }));
    return results;
  }

  // Diplome: returns nom, prenom and quality (seminariste or membreco)
  @Get('diplome/:id')
  async diplomeById(@Param('id') id: string) {
    const membre = await this.membreCoService.findOneById(id);
    if (membre) {
      return {
        nom: membre.nomPers,
        prenom: membre.pernomPers,
        qualite: 'membre du comité d\'organisation',
      };
    }

    try {
      const semi = await this.seminaristeService.findOneById(id);
      if (semi) {
        return {
          nom: semi.nomSemi,
          prenom: semi.prenomSemi,
          qualite: 'seminariste',
        };
      }
    } catch (err) {
      // ignore
    }

    // fallback to personne
    const persArr = await this.personneService.findOnePersById(id);
    const pers = Array.isArray(persArr) ? persArr[0] : persArr;
    if (pers) {
      return {
        nom: pers.nomPers,
        prenom: pers.pernomPers,
        qualite: 'personne',
      };
    }

    throw new NotFoundException('Utilisateur non trouvé');
  }

  @Post('diplome')
  async diplomesByIds(@Body('ids') ids: string[]) {
    if (!Array.isArray(ids)) throw new BadRequestException('Expected body { ids: string[] }');
    const results = await Promise.all(ids.map(async (id) => {
      try {
        const data = await this.diplomeById(id);
        return { id, data };
      } catch (err) {
        return { id, error: 'Utilisateur non trouvé' };
      }
    }));
    return results;
  }

}

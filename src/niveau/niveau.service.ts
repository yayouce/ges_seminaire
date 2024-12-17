import { Injectable, HttpException, UnauthorizedException } from '@nestjs/common';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';
import { Niveau } from './entities/niveau.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionEnum } from 'generique/commission.enum';

@Injectable()
export class NiveauService {
  constructor(
    @InjectRepository(Niveau)
    private niveauRepo: Repository<Niveau>,
  ) {}

  // Create Niveau
  async create(createNiveauDto: CreateNiveauDto, user) {
    try {
      const { membreCo, ...niveaudata } = createNiveauDto;
      if (
        user?.rolePers !== CommissionEnum.ACCUEIL &&
        user?.rolePers !== CommissionEnum.FORMATION &&
        user?.rolePers !== CommissionEnum.ADMINISTRATION
      ) {
        throw new HttpException('Access denied: Insufficient permissions', 701);
      }

      const newNiveau = await this.niveauRepo.create({
        ...niveaudata,
        membreCo: user,
      });
      await this.niveauRepo.save(newNiveau);
      return newNiveau;
    } catch (err) {
      throw new HttpException(`Error creating level: ${err.message}`, 702);
    }
  }

  // Find One Niveau
  async findOneNiveau(nomNiveau: string) {
    try {
      const niveau = await this.niveauRepo.findOneBy({ nomNiveau });
      if (!niveau) {
        throw new HttpException(`Level with name ${nomNiveau} not found`, 703);
      }
      return niveau;
    } catch (err) {
      throw new HttpException(`Error fetching level: ${err.message}`, 704);
    }
  }

  // Find All Niveaux
  async findAllNiveau() {
    try {
      return await this.niveauRepo.find();
    } catch (err) {
      throw new HttpException('Error fetching all levels', 705);
    }
  }

  // Seminaristes by Niveau
  async SeminaristesByNiveau() {
    try {
      const currentNiveau = await this.niveauRepo.find({ relations: ['seminariste'] });
      const tab = currentNiveau.map((dt: any) => ({
        niveau: dt.nomNiveau,
        seminaristes: dt.seminariste,
      }));
      return tab;
    } catch (err) {
      throw new HttpException('Error fetching seminarists by level', 706);
    }
  }
}

import { HttpException, Injectable,NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';
import { Repository } from 'typeorm';
import { Materiel } from './entities/materiel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { roleMembre } from 'generique/rolemembre.enum';

@Injectable()
export class MaterielService {
  constructor(
    @InjectRepository(Materiel)
    private materielRepo: Repository<Materiel>,
  ) {}

  async createMateriel(createMaterielDto: CreateMaterielDto, user) {
    const { membreCo, ...creation } = createMaterielDto;
    try {
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new HttpException("pas autorisé à ajouter materiel",702);
      }
      const newMateriel = this.materielRepo.create({
        ...creation,
        membreCo: user,
      });
      return await this.materielRepo.save(newMateriel);
    } catch (err) {
      throw err
    }
  }

  async updateMateriel(idMateriel: string, updateMaterielDto: UpdateMaterielDto, user: any) {
    const { membreCo, ...creation } = updateMaterielDto;
    try {
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new HttpException(
          "You are not authorized to update this material.",703
        );
      }
      const matl = await this.getOneMateriel(idMateriel);
      if (!matl) {
        throw new HttpException(`Material with ID ${idMateriel} not found.`,704);
      }
      const updateMateriel = await this.materielRepo.preload({
        idMateriel,
        ...creation,
      });
      if (!updateMateriel) {
        throw new HttpException(`Failed to load material with ID ${idMateriel}.`,705);
      }
      if (user.rolePers !== matl.membreCo.rolePers) {
        throw new HttpException("n'est pas votre material.",800);
      }
      return await this.materielRepo.save(updateMateriel);
    } catch (err) {
      throw err
    }
  }

  async getOneMateriel(idMateriel: string) {
    try {
      const materiel = await this.materielRepo.findOneBy({ idMateriel });
      if (!materiel) {
        throw new HttpException(`Material with ID ${idMateriel} not found.`,801);
      }
      return materiel;
    } catch (err) {
      throw err
    }
  }

  async deleteMateriel(idMateriel: string, user: any) {
    try {
      const materielToDelete = await this.materielRepo.findOneBy({ idMateriel });
      if (!materielToDelete) {
        throw new  HttpException(`Material with ID ${idMateriel} not found.`,801);
      }
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new HttpException("Only the responsible person can delete this material.",702);
      }
      if (user?.rolePers !== materielToDelete.membreCo?.rolePers) {
        throw new HttpException(
          "You are not authorized to delete this material because it is not yours.",803
        );
      }
      return await this.materielRepo.softDelete(idMateriel);
    } catch (err) {
      throw err
    }
  }

  async getStatisticsByCommission(user) {
    try {
      const materiels = await this.materielRepo.find({
        where: { membreCo: { idpers: user.idComi } },
      });
      const loues = materiels.filter((m) => m.statut === 'Loue').length;
      const achetes = materiels.filter((m) => m.statut === 'achete').length;
      const totalDepenses = materiels.reduce((sum, m) => sum + Number(m.cout || 0), 0);
      return {
        loues,
        achetes,
        totalDepenses,
      };
    } catch (err) {
      throw err
    }
  }
}

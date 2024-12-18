import { HttpException, Injectable,NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';
import { CommissionEnum } from 'generique/commission.enum';
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
        throw new UnauthorizedException("You are not authorized to create material.");
      }
      const newMateriel = this.materielRepo.create({
        ...creation,
        membreCo: user,
      });
      return await this.materielRepo.save(newMateriel);
    } catch (err) {
      throw new HttpException(`Error creating material: ${err.message}`, 701);
    }
  }

  async updateMateriel(idMateriel: string, updateMaterielDto: UpdateMaterielDto, user: any) {
    const { membreCo, ...creation } = updateMaterielDto;
    try {
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new UnauthorizedException(
          "You are not authorized to update this material."
        );
      }
      const matl = await this.getOneMateriel(idMateriel);
      if (!matl) {
        throw new NotFoundException(`Material with ID ${idMateriel} not found.`);
      }
      const updateMateriel = await this.materielRepo.preload({
        idMateriel,
        ...creation,
      });
      if (!updateMateriel) {
        throw new NotFoundException(`Failed to load material with ID ${idMateriel}.`);
      }
      if (user.rolePers !== matl.membreCo.rolePers) {
        throw new UnauthorizedException("You are not the owner of this material.");
      }
      return await this.materielRepo.save(updateMateriel);
    } catch (err) {
      throw new HttpException(`Error updating material: ${err.message}`, 702);
    }
  }

  async getOneMateriel(idMateriel: string) {
    try {
      const materiel = await this.materielRepo.findOneBy({ idMateriel });
      if (!materiel) {
        throw new NotFoundException(`Material with ID ${idMateriel} not found.`);
      }
      return materiel;
    } catch (err) {
      throw new HttpException(`Error fetching material: ${err.message}`, 703);
    }
  }

  async deleteMateriel(idMateriel: string, user: any) {
    try {
      const materielToDelete = await this.materielRepo.findOneBy({ idMateriel });
      if (!materielToDelete) {
        throw new NotFoundException(`Material with ID ${idMateriel} not found.`);
      }
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new UnauthorizedException("Only the responsible person can delete this material.");
      }
      if (user?.rolePers !== materielToDelete.membreCo?.rolePers) {
        throw new UnauthorizedException(
          "You are not authorized to delete this material because it is not yours."
        );
      }
      return await this.materielRepo.softDelete(idMateriel);
    } catch (err) {
      throw new HttpException(`Error deleting material: ${err.message}`, 704);
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
      throw new HttpException(`Error fetching statistics: ${err.message}`, 705);
    }
  }
}

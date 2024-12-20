import { Injectable, HttpException } from '@nestjs/common';
import { CreateVisiteurDto } from './dto/create-visiteur.dto';
import { UpdateVisiteurDto } from './dto/update-visiteur.dto';
import { Repository } from 'typeorm';
import { Visiteur } from './entities/visiteur.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionEnum } from 'generique/commission.enum';

@Injectable()
export class VisiteurService {
  @InjectRepository(Visiteur)
  private visiteurRepository: Repository<Visiteur>;

  async createNewVisiteur(createVisiteurDto: CreateVisiteurDto, user) {
    try {
      const { membreCo, ...visiteurData } = createVisiteurDto;
      if (user?.rolePers !== CommissionEnum.ACCUEIL) {
        throw new HttpException('Access denied: Insufficient permissions', 701);
      }

      const newVisiteur = this.visiteurRepository.create({
        ...visiteurData,
        membreCo: user,
      });

      await this.visiteurRepository.save(newVisiteur);
      return newVisiteur;
    } catch (err) {
      throw err
    }
  }

  async findAll() {
    try {
      return await this.visiteurRepository.find();
    } catch (err) {
      throw err
    }
  }

  async findSoftDeletedVisiteurs(): Promise<Visiteur[]> {
    try {
      return await this.visiteurRepository
        .createQueryBuilder('visiteur')
        .where('visiteur.deletedAt IS NOT NULL')
        .withDeleted()
        .getMany();
    } catch (err) {
      throw err
    }
  }

  async updateVisiteur(idVisiteur: string, updateVisiteurDto: UpdateVisiteurDto, user) {
    try {
      if (user?.rolePers !== CommissionEnum.ACCUEIL) {
        throw new HttpException('Access denied: Insufficient permissions', 701);
      }

      const { membreCo, ...visiteurData } = updateVisiteurDto;
      const updateVisiteur = await this.visiteurRepository.preload({
        idVisiteur,
        ...visiteurData,
      });

      if (!updateVisiteur) {
        throw new HttpException(`Visitor with ID ${idVisiteur} not found`, 705);
      }

      await this.visiteurRepository.save(updateVisiteur);
      return updateVisiteur;
    } catch (err) {
      throw err
    }
  }

  async findOneById(idVisiteur: string) {
    try {
      const visiteur = await this.visiteurRepository.findOneBy({ idVisiteur });
      if (!visiteur) {
        throw new HttpException(`Visitor with ID ${idVisiteur} not found`, 705);
      }
      return visiteur;
    } catch (err) {
      throw err
    }
  }

  async VisiteTotalParJour() {
    try {
      const result = await this.visiteurRepository
        .createQueryBuilder('visiteur')
        .select('DATE(visiteur.createdAt)', 'date')
        .addSelect('COUNT(*)', 'totalVisites')
        .addSelect('SUM(CASE WHEN visiteur.deletedAt IS NOT NULL THEN 1 ELSE 0 END)', 'softDeletedVisites')
        .withDeleted()
        .groupBy('DATE(visiteur.createdAt)')
        .orderBy('date', 'DESC')
        .getRawMany();

      return result.map((row) => ({
        date: row.date,
        totalVisites: Number(row.totalVisites),
        softDeletedVisites: Number(row.softDeletedVisites),
      }));
    } catch (err) {
      throw err
    }
  }

  async VisiteTotalParJourParGenre(date: string): Promise<{ date: string; totalVisites: number; genreVisiteur: Record<string, number> }> {
    try {
      const result = await this.visiteurRepository
        .createQueryBuilder('visiteur')
        .select('DATE(visiteur.createdAt)', 'date')
        .addSelect('visiteur.genreVisiteur', 'genre')
        .addSelect('COUNT(*)', 'total')
        .withDeleted()
        .where('DATE(visiteur.createdAt) = :date', { date })
        .groupBy('DATE(visiteur.createdAt)')
        .addGroupBy('visiteur.genreVisiteur')
        .getRawMany();

      const genreData: Record<string, number> = {
        frere: 0,
        soeur: 0,
        non_defini: 0,
      };

      let totalVisites = 0;

      result.forEach((row) => {
        const genre = row.genre || 'non_defini';
        const total = Number(row.total);

        if (genreData.hasOwnProperty(genre)) {
          genreData[genre] += total;
        }

        totalVisites += total;
      });

      return {
        date,
        totalVisites,
        genreVisiteur: genreData,
      };
    } catch (err) {
      throw err
    }
  }

  async VisiteTotalParGenre(): Promise<{ totalVisites: number; genreVisiteur: Record<string, number> }> {
    try {
      const result = await this.visiteurRepository
        .createQueryBuilder('visiteur')
        .select('visiteur.genreVisiteur', 'genre')
        .addSelect('COUNT(*)', 'total')
        .withDeleted()
        .groupBy('visiteur.genreVisiteur')
        .getRawMany();

      const genreData: Record<string, number> = {
        frere: 0,
        soeur: 0,
        non_defini: 0,
      };

      let totalVisites = 0;

      result.forEach((row) => {
        const genre = row.genre || 'non_defini';
        const total = Number(row.total);

        if (genreData.hasOwnProperty(genre)) {
          genreData[genre] += total;
        }

        totalVisites += total;
      });

      return {
        totalVisites,
        genreVisiteur: genreData,
      };
    } catch (err) {
      throw err
    }
  }

  async softdeleteVisiteur(idVisiteur: string, user) {
    try {
      if (user?.rolePers !== CommissionEnum.ACCUEIL) {
        throw new HttpException('Access denied: Insufficient permissions', 701);
      }
      const visiteurToDelete = await this.visiteurRepository.findOneBy({ idVisiteur });
      if (!visiteurToDelete) {
        throw new HttpException(`Visitor with ID ${idVisiteur} not found`, 705);
      }
      await this.visiteurRepository.softDelete(idVisiteur);
      return { message: 'Visitor soft deleted successfully' };
    } catch (err) {
      throw err
    }
  }

  async deleteVisiteur(idVisiteur: string, user) {
    try {
      if (user?.rolePers !== CommissionEnum.ACCUEIL) {
        throw new HttpException('Access denied: Insufficient permissions', 701);
      }
      const visiteurToDelete = await this.visiteurRepository.findOneBy({ idVisiteur });
      if (!visiteurToDelete) {
        throw new HttpException(`Visitor with ID ${idVisiteur} not found`, 705);
      }
      await this.visiteurRepository.delete(idVisiteur);
      return { message: 'Visitor deleted successfully' };
    } catch (err) {
      throw err
    }
  }
}

import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { Repository } from 'typeorm';
import { CommissionEntity } from './entities/commission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';

@Injectable()
export class CommissionService {
  constructor(
    @InjectRepository(CommissionEntity)
    private commissionRepository: Repository<CommissionEntity>,
  ) {}

  async findOne(membrecomi) {
    try {
      const commission = await this.commissionRepository.findOne({
        where: { libelleComi: membrecomi },
      });
      return commission;
    } catch (err) {
       throw err
    }
  }

  async createCommision(createCommission: CreateCommissionDto) {
    try {
      return await this.commissionRepository.save(createCommission);
    } catch (err) {
       throw err
    }
  }

  async findByLibelle(libell) {
    try {
      return await this.commissionRepository.findOneBy(libell);
    } catch (err) {
       throw err
    }
  }

  async findAllComi() {
    try {
      return await this.commissionRepository.find();
    } catch (err) {
       throw err
    }
  }

  async findTotalByGenderComi() {
    try {
      const commission = await this.commissionRepository.find();

      const tab = commission.map((dt: any) => {
        const nbFrere = dt.membres.filter((m: any) => m.genrePers === 'frere').length;
        const nbSoeur = dt.membres.filter((m: any) => m.genrePers === 'soeur').length;
        return {
          commission: dt.libelleComi,
          total_frères: nbFrere,
          total_soeurs: nbSoeur,
          total_membres: dt.membres.length,
        };
      });
      return tab;
    } catch (err) {
       throw err
    }
  }

  async mapCommissionWithMaterials() {
    try {
      const commissions = await this.commissionRepository.find({
        relations: ['membres', 'membres.materiel'],
      });

      const result = commissions.map((commission: any) => {
        const rentedMaterials = commission.membres.flatMap((member: any) =>
          member.materiel.filter((material: any) => material.statut === 'Loue'),
        );
        const purchasedMaterials = commission.membres.flatMap((member: any) =>
          member.materiel.filter((material: any) => material.statut === 'achete'),
        );

        const totalRented = rentedMaterials.reduce((sum, material: any) => sum + material.quantite, 0);
        const totalPurchased = purchasedMaterials.reduce((sum, material: any) => sum + material.quantite, 0);
        const totalMaterials = totalRented + totalPurchased;
        const totalSpent = [...rentedMaterials, ...purchasedMaterials].reduce(
          (sum, material: any) => sum + (material.cout || 0),
          0,
        );

        return {
          commission: commission.libelleComi,
          materiels_loues: totalRented,
          materiels_achete: totalPurchased,
          total_materiels: totalMaterials,
          total_depense: totalSpent,
        };
      });

      return result;
    } catch (err) {
       throw err
    }
  }

  async listeMembreByCo() {
    try {
      const currentComi = await this.commissionRepository.find();
      const tab = currentComi.map((dt: any) => {
        return {
          commission: dt.libelleComi,
          membres: dt.membres,
        };
      });
      return tab;
    } catch (err) {
       throw err
    }
  }
}

import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MembreCoEntity } from './entities/membre_co.entity';
import { Repository } from 'typeorm';
import { CommissionService } from 'src/commission/commission.service';
import * as bcrypt from 'bcrypt';
import { roleMembre } from 'generique/rolemembre.enum';
import { CommissionEnum } from 'generique/commission.enum';

const saltOrRounds = 10;
@Injectable()
export class MembreCoService {
  constructor(
    @InjectRepository(MembreCoEntity)
    private membreRepository: Repository<MembreCoEntity>,
    private commissionService: CommissionService,
  ) {}

  // Find One Member
  async findOne(phone) {
    try {
      return await this.membreRepository.findOne({
        where: { phonePers: phone },
      });
    } catch (err) {
      throw new HttpException(`Error finding member: ${err.message}`, 701);
    }
  }

  // Members by Commission
  async membreCoParcomi() {
    try {
      const result = await this.membreRepository
        .createQueryBuilder('membreco')
        .select('*')
        .groupBy('membreco.rolePers')
        .getRawMany();
      return result;
    } catch (err) {
      throw new HttpException(`Error fetching members by commission: ${err.message}`, 702);
    }
  }

  // Create Member
  async createMembreCo(createmembreco: CreateMembreCoDto, user) {
    try {
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new UnauthorizedException();
      }
      const commission = await this.commissionService.findOne(createmembreco.commission);
      if (!commission) {
        throw new HttpException('Commission not found', 703);
      }
      createmembreco.rolePers = commission.libelleComi;

      if (
        user.rolePers !== createmembreco.rolePers &&
        user.rolePers !== CommissionEnum.ADMINISTRATION
      ) {
        throw new UnauthorizedException("You are not authorized for this commission");
      }

      const hashedpassword = await bcrypt.hash(createmembreco.motPass, saltOrRounds);
      const membreCo = this.membreRepository.create({
        ...createmembreco,
        rolePers: commission.libelleComi,
        motPass: hashedpassword,
        commission,
      });
      return await this.membreRepository.save(membreCo);
    } catch (err) {
      throw new HttpException(`Error creating member: ${err.message}`, 704);
    }
  }

  // Delete Member
  async deleteMembreCo(idpers: string, user) {
    try {
      const membreDelete = await this.membreRepository.findOneBy({ idpers });
      if (!membreDelete) {
        throw new NotFoundException('Member not found');
      }
      // if (
      //   user?.rolePers !== CommissionEnum.ACCUEIL &&
      //   user?.rolePers !== CommissionEnum.ADMINISTRATION
      // ) {
      //   throw new UnauthorizedException();
      // }
      return await this.membreRepository.softDelete(idpers);
    } catch (err) {
      throw new HttpException(`Error deleting member: ${err.message}`, 705);
    }
  }

  // Update Member
  async updateMembre(idpers: string, updateMembreCoDto: UpdateMembreCoDto, user) {
    try {
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new UnauthorizedException("You are not a responsible");
      }

      const membre = await this.membreRepository.findOne({
        where: { idpers },
        relations: ['commission'],
      });

      if (!membre) {
        throw new NotFoundException(`Member with ID ${idpers} not found`);
      }

      let commission = membre.commission;
      if (updateMembreCoDto.commission) {
        commission = await this.commissionService.findOne(updateMembreCoDto.commission);
        if (!commission) {
          throw new NotFoundException(
            `Commission with ID ${updateMembreCoDto.commission} not found`,
          );
        }
        updateMembreCoDto.rolePers = commission.libelleComi;
      }

      // if (
      //   user.rolePers !== CommissionEnum.ADMINISTRATION &&
      //   user.rolePers !== CommissionEnum.ACCUEIL
      // ) {
      //   throw new UnauthorizedException(
      //     "You are not authorized to update this member",
      //   );
      // }

      const updatedMembre = await this.membreRepository.preload({
        idpers,
        ...updateMembreCoDto,
        commission,
      });

      if (!updatedMembre) {
        throw new NotFoundException(
          `Failed to preload data for member with ID ${idpers}`,
        );
      }
      return await this.membreRepository.save(updatedMembre);
    } catch (err) {
      throw new HttpException(`Error updating member: ${err.message}`, 706);
    }
  }

  // Get All Members
  async getmembreco() {
    try {
      return await this.membreRepository.find();
    } catch (err) {
      throw new HttpException('Error fetching members', 707);
    }
  }

  async getPco() {
    try {
      return await this.membreRepository.findBy({ rolePers: 'Pco' });
    } catch (err) {
      throw new HttpException('Error fetching PCO members', 708);
    }
  }



  async getPcobyId(idpers:string) {
    try {
      return await this.membreRepository.findBy({ rolePers: 'Pco',idpers });
    } catch (err) {
      throw new HttpException('Error fetching PCO members', 708);
    }
  }

  // Stats: Members by Commission and Gender
  async membreCoByGender(): Promise<Record<string, Record<string, number>>> {
    try {
      const result = await this.membreRepository
        .createQueryBuilder('membreco')
        .select('membreco.genrePers', 'genre')
        .addSelect('membreco.rolePers', 'commission')
        .addSelect('COUNT(*)', 'total')
        .groupBy('membreco.rolePers')
        .addGroupBy('membreco.genrePers')
        .getRawMany();

      const groupedData: Record<string, Record<string, number>> = {};
      result.forEach((row) => {
        const commission = row.commission;
        const genre = row.genre.toLowerCase();
        const total = Number(row.total);
        if (!groupedData[commission]) {
          groupedData[commission] = { frere: 0, soeur: 0, Total: 0 };
        }
        groupedData[commission][genre] = total;
        groupedData[commission].Total += total;
      });
      return groupedData;
    } catch (err) {
      throw new HttpException('Error fetching members by gender', 709);
    }
  }

  async membreCoTotalByGender() {
    try {
      const result = await this.membreRepository
        .createQueryBuilder('membreco')
        .select('membreco.genrePers', 'genre')
        .addSelect('COUNT(*)', 'total')
        .groupBy('membreco.genrePers')
        .getRawMany();

      const consolidatedData: Record<string, number> = {
        frere: 0,
        soeur: 0,
        non_defini: 0,
      };

      result.forEach((row) => {
        const genre = row.genre || 'non_defini';
        if (consolidatedData.hasOwnProperty(genre)) {
          consolidatedData[genre] = Number(row.total);
        }
      });

      return consolidatedData;
    } catch (err) {
      throw new HttpException('Error fetching total members by gender', 710);
    }
  }

  async findTotalByGenderFormateur() {
    try {
      const result = await this.membreRepository
        .createQueryBuilder('membreco')
        .select('membreco.genrePers', 'genre')
        .addSelect('COUNT(*)', 'total')
        .where('membreco.rolePers = :role', { role: 'Formation' })
        .groupBy('membreco.genrePers')
        .getRawMany();

      const consolidatedData: Record<string, number> = {
        frere: 0,
        soeur: 0,
        non_defini: 0,
      };

     
      result.forEach((row) => {
        const genre = row.genre || 'non_defini';
        if (consolidatedData.hasOwnProperty(genre)) {
          consolidatedData[genre] = Number(row.total);
        }
      });
      const totalGeneral = Object.values(consolidatedData).reduce((sum, value) => sum + value, 0);
      return {
        ...consolidatedData,
        total_general: totalGeneral,
      };
    } catch (err) {
      throw new HttpException('Error fetching total formateur members by gender', 711);
    }
  }
}

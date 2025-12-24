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
      throw err
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
      throw err
    }
  }

  // Create Member
  // async createMembreCo(createmembreco: CreateMembreCoDto, user) {
  //   try {
  //     if (user?.roleMembre !== roleMembre.RESP && user?.role !== "SUPERADMIN"
  //     ) {
  //       throw new UnauthorizedException();
  //     }
  //     const commission = await this.commissionService.findOne(createmembreco.commission);
  //     if (!commission) {
  //       throw new HttpException('Commission non trouvé', 703);
  //     }
  //     createmembreco.rolePers = commission.libelleComi;

  //     if (
  //       user.rolePers !== createmembreco.rolePers &&
  //       user.rolePers !== CommissionEnum.ADMINISTRATION
  //       && user.rolePers !== CommissionEnum.ACCUEIL
  //     ) {
  //       throw  new HttpException('pas autorisé à ajouter ce membre dans votre commission', 704);
  //     }

  //     const hashedpassword = await bcrypt.hash(createmembreco.motPass, saltOrRounds);
  //     const membreCo = this.membreRepository.create({
  //       ...createmembreco,
  //       rolePers: commission.libelleComi,
  //       motPass: hashedpassword,
  //       commission,
  //     });
  //     return await this.membreRepository.save(membreCo);
  //   } catch (err) {
      
  //     throw err;
  //   }
  // }

  // Delete Member
  
  
async createMembreCo(createmembreco: CreateMembreCoDto, user) {
  try {
    // 1. Identification du rôle à partir du token (payload)
    const isSuperAdmin = user?.isSuperAdmin === true; // On vérifie le booléen du JWT
    const isResponsable = user?.roleMembre === roleMembre.RESP;

    // Autoriser si c'est un Superadmin OU un Responsable
    if (!isSuperAdmin && !isResponsable) {
      throw new UnauthorizedException("Vous n'avez pas les droits requis");
    }

    // 2. Vérification de la commission cible
    const commission = await this.commissionService.findOne(createmembreco.commission);
    if (!commission) {
      throw new HttpException('Commission non trouvée', 703);
    }

    // 3. Logique de restriction par commission
    // Si l'utilisateur n'est PAS Superadmin, on vérifie s'il a le droit d'ajouter dans CETTE commission
    if (!isSuperAdmin) {
      const isAllowed = 
        user.rolePers === commission.libelleComi || // Même commission
        user.rolePers === CommissionEnum.ADMINISTRATION || // Est de l'administration
        user.rolePers === CommissionEnum.ACCUEIL; // Est de l'accueil

      if (!isAllowed) {
        throw new HttpException('Pas autorisé à ajouter un membre dans cette commission', 704);
      }
    }

    // 4. Création du membre
    const hashedpassword = await bcrypt.hash(createmembreco.motPass, saltOrRounds);
    
    const membreCo = this.membreRepository.create({
      ...createmembreco,
      rolePers: commission.libelleComi, // On assigne le libellé de la commission comme rôle perso
      motPass: hashedpassword,
      commission,
    });

    return await this.membreRepository.save(membreCo);
    
  } catch (err) {
    // Si c'est déjà une HttpException (401, 703, 704), on la renvoie telle quelle
    if (err instanceof HttpException) {
      throw err;
    }
    // Sinon, erreur interne
    throw new HttpException("Erreur lors de la création du membre", 500);
  }
}
  
  async deleteMembreCo(idpers: string) {
    try {
      const membreDelete = await this.membreRepository.findOneBy({ idpers });
      if (!membreDelete) {
        throw new HttpException('Member not found',705);
      }
    
      return await this.membreRepository.softDelete(idpers);
    } catch (err) {
      throw err
    }
  }

  // Update Member
  async updateMembre(idpers: string, updateMembreCoDto: UpdateMembreCoDto, user) {
    try {
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new HttpException("soyez le responsable de la commission",706);
      }

      const membre = await this.membreRepository.findOne({
        where: { idpers },
        relations: ['commission'],
      });
    
      if (!membre) {

        throw  new HttpException(`utilisateur non trouvé`, 707);
       
      }

      let commission = membre.commission;
      if (updateMembreCoDto.commission) {
        commission = await this.commissionService.findOne(updateMembreCoDto.commission);
        if (!commission) {
          throw new HttpException(
            `commission non trouvé`,708
          );
        }
        updateMembreCoDto.rolePers = commission.libelleComi;
      }

      if (updateMembreCoDto.motPass) {
        updateMembreCoDto.motPass = await bcrypt.hash(updateMembreCoDto.motPass, saltOrRounds);
      }



      const updatedMembre = await this.membreRepository.preload({
        idpers,
        ...updateMembreCoDto,
        commission,
      });

      if (!updatedMembre) {
        throw new HttpException(
          `Failed to preload data for member with ID ${idpers}`,709
        );
      }
      return await this.membreRepository.save(updatedMembre);
    } catch (err) {
      throw err
    }
  }

  // Get All Members
  async getmembreco() {
    try {
      return await this.membreRepository.find();
    } catch (err) {
      throw err
    }
  }

  async getPco() {
    try {
      return await this.membreRepository.findBy({ rolePers: 'Pco' });
    } catch (err) {
      throw err
    }
  }



  async getPcobyId(idpers:string) {
    try {
      return await this.membreRepository.findBy({ rolePers: 'Pco',idpers });
    } catch (err) {
      throw err
    }
  }


  async getCobyId(idpers) {
    try {
      return await this.membreRepository.findBy({idpers});
    } catch (err) {
      throw err
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
      throw err
    }
  }

  async   membreCoTotalByGender() {
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
      throw err
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
      throw err
    }
  }
}

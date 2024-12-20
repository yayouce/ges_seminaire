import {  Injectable, HttpException } from '@nestjs/common';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';
import { Repository } from 'typeorm';
import { SeminaristeEntity } from './entities/seminariste.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionEnum } from 'generique/commission.enum';
import { DortoirsService } from 'src/dortoirs/dortoirs.service';
import { NiveauService } from 'src/niveau/niveau.service';

@Injectable()
export class SeminaristeService {
constructor(
  @InjectRepository(SeminaristeEntity)
  private seminaristeRepository: Repository<SeminaristeEntity>,
  private dortoirservice: DortoirsService,
  private niveauService: NiveauService
) {}

// Creation
async createNewSemi(createSeminaristeDto: CreateSeminaristeDto, user) {
  try {
    const { dortoir, genreSemi, membreCo, age, etatSante, niveau, ...seminaristedata } = createSeminaristeDto;
    if (user?.rolePers !== CommissionEnum.ACCUEIL) {
      throw new HttpException('Access denied: Insufficient permissions', 701);
    }

    const founddortoir = await this.dortoirservice.findOneDortoir(dortoir);
    if (!founddortoir) {
      throw new HttpException('Dormitory not found', 702);
    }

    if (genreSemi !== founddortoir.genre) {
      throw new HttpException("The seminarist's gender does not match the dormitory", 703);
    }

    if (age <= 6) {
      createSeminaristeDto.categorie = 'Pepinieres';
    } else if (age > 6 && age <= 10) {
      createSeminaristeDto.categorie = 'Enfants';
    } else {
      createSeminaristeDto.categorie = 'Jeunes_et_adultes';
    }

    if (etatSante !== 'Malade' && etatSante !== 'Autres') {
      createSeminaristeDto.problemeSante = 'Ras';
    }

    const newSeminariste = await this.seminaristeRepository.create({
      ...seminaristedata,
      age: createSeminaristeDto.age,
      etatSante: createSeminaristeDto.etatSante,
      problemeSante: createSeminaristeDto.problemeSante,
      categorie: createSeminaristeDto.categorie,
      nomdortoir: founddortoir.nomDortoir,
      membreCo: user,
      dortoir: founddortoir,
      genreSemi,
    });
    await this.seminaristeRepository.save(newSeminariste);
    return newSeminariste;
  } catch (err) {
    throw new HttpException(`Error creating seminarist: ${err.message}`, 704);
  }
}

// Update
async updatesemi(idSemi: string, updateseminaristeDto: UpdateSeminaristeDto, user) {
  try {
    const { dortoir, membreCo, niveau,genreSemi, ...semi } = updateseminaristeDto;
    const founddortoir = await this.dortoirservice.findOneDortoir(dortoir);
    if (!founddortoir) {
      throw new HttpException('Dormitory not found', 702);
    }
    
    if (genreSemi !== founddortoir.genre) {
      throw new HttpException("le genre du seminariste n'est pas autorisé pour ce dortoir", 701);
    }

    const foundniveau = await this.niveauService.findOneNiveau(niveau);
    if (!foundniveau) {
      throw new HttpException('Level not found', 705);
    }

    const updateSemi = await this.seminaristeRepository.preload({
      idSemi,
      niveau: foundniveau,
      dortoir: founddortoir,
      nomdortoir: founddortoir.nomDortoir,
      membreCo: user,
      genreSemi,
      ...semi,
    });

    if (!updateSemi) {
      throw new HttpException(`Seminarist with ID ${idSemi} not found`, 706);
    }
    if (user?.rolePers !== CommissionEnum.ACCUEIL && user?.rolePers !== CommissionEnum.FORMATION) {
      throw new HttpException('Access denied: Insufficient permissions', 701);
    }

    await this.seminaristeRepository.save(updateSemi);
    return updateSemi;
  } catch (err) {
    throw new err
  }
}

// Delete
async deleteSeminariste(idSemi: string, user) {
  try {
    const seminaristeDelete = await this.seminaristeRepository.findOneBy({ idSemi });
    if (!seminaristeDelete) {
      throw new HttpException('Seminarist not found', 706);
    }
    if (user?.rolePers !== CommissionEnum.ACCUEIL) {
      throw new HttpException('Access denied: Insufficient permissions', 701);
    }
    await this.seminaristeRepository.softDelete(idSemi);
    return { message: 'Seminarist soft deleted successfully' };
  } catch (err) {
    throw new HttpException(`Error deleting seminarist: ${err.message}`, 708);
  }
}

async findOneById(idParam: string) {
  try {
    const seminariste = await this.seminaristeRepository
      .createQueryBuilder('seminariste')
      .leftJoinAndSelect('seminariste.niveau', 'niveau')
      .leftJoinAndSelect('seminariste.dortoir', 'dortoir')
      .leftJoinAndSelect('seminariste.membreCo', 'membreCo')
      .where('seminariste.idSemi = :id', { id: idParam })
      .getOne();
    if (!seminariste) {
      throw new HttpException(`Seminarist with ID ${idParam} not found`, 706);
    }
    return seminariste;
  } catch (err) {
    throw new err
  }
}

// Find All
async findAll() {
  try {
    return await this.seminaristeRepository.find();
  } catch (err) {
    throw new err
  }
}

// Seminarists by Gender
async SeminaristeByGender(): Promise<Record<string, number>> {
  try {
    const result = await this.seminaristeRepository
      .createQueryBuilder('seminariste')
      .select('seminariste.genreSemi', 'genre')
      .addSelect('COUNT(*)', 'total')
      .groupBy('seminariste.genreSemi')
      .getRawMany();

    const data: Record<string, number> = { frere: 0, soeur: 0, non_defini: 0, Total: 0 };

    result.forEach((row) => {
      const genre = row.genre?.toLowerCase() || 'non_defini';
      const total = Number(row.total);
      if (data.hasOwnProperty(genre)) {
        data[genre] += total;
      }
      data.Total += total;
    });

    return data;
  } catch (err) {
    throw new HttpException('Error fetching seminarists by gender', 711);
  }
}

// Seminarists by Category and Gender
async SeminaristeCategByGender(): Promise<Record<string, number>> {
  try {
    const result = await this.seminaristeRepository
      .createQueryBuilder('seminariste')
      .select('seminariste.genreSemi', 'genre')
      .addSelect('seminariste.categorie', 'categorie')
      .addSelect('COUNT(*)', 'total')
      .groupBy('seminariste.genreSemi')
      .getRawMany();

    const data: Record<string, number> = { frere: 0, soeur: 0, Total: 0 };
    result.forEach((row) => {
      const genre = row.genre?.toLowerCase() || 'non_defini';
      const total = Number(row.total);
      if (data.hasOwnProperty(genre)) {
        data[genre] += total;
      }
      data.Total += total;
    });

    return data;
  } catch (err) {
    throw new err
  }
}

// Seminarists by Category
async SeminaristeByCateg(): Promise<any> {
  try {
    const categories = ['Pepinieres', 'Enfants', 'Jeunes_et_Adultes', 'Non_specifie'];

    const result = await this.seminaristeRepository
      .createQueryBuilder('seminariste')
      .select('seminariste.categorie', 'categorie')
      .addSelect('seminariste.genreSemi', 'genre')
      .addSelect('COUNT(*)', 'total')
      .groupBy('seminariste.categorie')
      .addGroupBy('seminariste.genreSemi')
      .getRawMany();

    const data: Record<string, { totalFrere: number; totalSoeur: number }> = {};
    categories.forEach((category) => {
      data[category] = { totalFrere: 0, totalSoeur: 0 };
    });

    result.forEach((row) => {
      const categorie = row.categorie;
      const genre = row.genre?.toLowerCase();
      const total = Number(row.total);
      if (data[categorie]) {
        if (genre === 'frere') {
          data[categorie].totalFrere += total;
        } else if (genre === 'soeur') {
          data[categorie].totalSoeur += total;
        }
      }
    });

    return Object.entries(data).reduce((acc, [categorie, { totalFrere, totalSoeur }]) => {
      acc[categorie] = { totalFrere, totalSoeur };
      return acc;
    }, {});
  } catch (err) {
    throw new err
  }
}
}

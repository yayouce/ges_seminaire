import {  Injectable, HttpException } from '@nestjs/common';
import { CreateSeminaristeDto } from './dto/create-seminariste.dto';
import { UpdateSeminaristeDto } from './dto/update-seminariste.dto';
import { Repository } from 'typeorm';
import { SeminaristeEntity } from './entities/seminariste.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionEnum } from 'generique/commission.enum';
import { categorieSem } from 'generique/categorieSeminariste.enum';
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

// Fonction pour formater le matricule au format IKH-XXXX
private formatMatricule(matriculeInput: string): string {
  // Extraire uniquement les chiffres du matricule
  const numericPart = matriculeInput.replace(/\D/g, '');
  // Formater avec padding de 4 chiffres
  const paddedNumber = numericPart.padStart(4, '0');
  return `IKH-${paddedNumber}`;
}

// Détermine la catégorie à partir de l'âge
private computeCategory(age: number): string {
  if (age === undefined || age === null || isNaN(Number(age))) return categorieSem.NON_SPECIFIE;
  const a = Number(age);
  if (a >= 0 && a <= 6) return categorieSem.PEPINIERES;
  if (a >= 7 && a <= 12) return categorieSem.ENFANTS;
  if (a >= 13) return categorieSem.JEUNES_ADULTES;
  return categorieSem.NON_SPECIFIE;
}

// Creation
async createNewSemi(createSeminaristeDto: CreateSeminaristeDto, user) {
  try {
    const { dortoir, genreSemi, membreCo, age, etatSante, niveau, matricule, ...seminaristedata } = createSeminaristeDto;
    // Autoriser les superadmins à créer des séminaristes
    if (!user?.isSuperAdmin && user?.rolePers !== CommissionEnum.ACCUEIL) {
      throw new HttpException('Access denied: Insufficient permissions', 701);
    }

    // Formater le matricule au format IKH-XXXX
    const formattedMatricule = this.formatMatricule(matricule);

    // Vérifier si le matricule existe déjà
    const existingByMatricule = await this.seminaristeRepository.findOne({
      where: { matricule: formattedMatricule }
    });
    if (existingByMatricule) {
      throw new HttpException('Un séminariste avec ce matricule existe déjà', 709);
    }

    // Vérifier la duplication par nom, prénom  téléphone et matricule
    const existingByIdentity = await this.seminaristeRepository.findOne({
      where: {
        nomSemi: createSeminaristeDto.nomSemi,
        prenomSemi: createSeminaristeDto.prenomSemi,
        phoneSemi: createSeminaristeDto.phoneSemi,
        matricule: createSeminaristeDto.matricule
      }
    });
    if (existingByIdentity) {
      throw new HttpException('Cette personne est déjà enregistrée comme séminariste', 710);
    }

    const founddortoir = await this.dortoirservice.findOneDortoir(dortoir);
    if (!founddortoir) {
      throw new HttpException('Dormitory not found', 702);
    }

    let foundniveau = null;
    // If frontend provides `nomNiveau`, resolve it to a Niveau entity; otherwise leave null
    if (createSeminaristeDto.nomNiveau) {
      foundniveau = await this.niveauService.findOneNiveau(createSeminaristeDto.nomNiveau).catch(() => null);
    }
    if (genreSemi !== founddortoir.genre) {
      throw new HttpException("The seminarist's gender does not match the dormitory", 703);
    }

    // La catégorie est maintenant gérée par le front-end, pas de calcul automatique basé sur l'âge

    if (etatSante !== 'Malade' && etatSante !== 'Autres') {
      createSeminaristeDto.problemeSante = 'Ras';
    }

    // Normalize names to uppercase before saving
    if (seminaristedata.nomSemi) seminaristedata.nomSemi = seminaristedata.nomSemi.toUpperCase();
    if (seminaristedata.prenomSemi) seminaristedata.prenomSemi = seminaristedata.prenomSemi.toUpperCase();

    const newSeminariste = await this.seminaristeRepository.create({
      ...seminaristedata,
      matricule: formattedMatricule,
      age: createSeminaristeDto.age,
      etatSante: createSeminaristeDto.etatSante,
      problemeSante: createSeminaristeDto.problemeSante,
      // catégorie déterminée automatiquement à partir de l'âge
      categorie: this.computeCategory(createSeminaristeDto.age),
      nomdortoir: founddortoir.nomDortoir,
      membreCo: user,
      dortoir: founddortoir,
      genreSemi,
      // set relation and readable name if we resolved a niveau; allow null when none provided
      niveau: foundniveau || null,
      nomNiveau: foundniveau ? foundniveau.nomNiveau : (createSeminaristeDto.nomNiveau ?? null),
    });
    await this.seminaristeRepository.save(newSeminariste);
    return newSeminariste;
  } catch (err) {
    throw new HttpException(`Error creating seminarist: ${err.message}`, 704);
  }
}

// Update
async updatesemi(idSemi: string, updateSeminaristeDto: UpdateSeminaristeDto, user) {
  try {
    const { dortoir, genreSemi, age, etatSante,nomNiveau, ...updatedData } = updateSeminaristeDto;

    // Autoriser les superadmins à modifier des séminaristes
    if (!user?.isSuperAdmin && user?.rolePers !== CommissionEnum.ACCUEIL && user?.rolePers !== CommissionEnum.ADMINISTRATION && user?.rolePers !== CommissionEnum.FORMATION) {
      throw new HttpException('Access denied: Insufficient permissions', 701);
    }
    const seminariste = await this.seminaristeRepository.findOne({ where: { idSemi } });
    if (!seminariste) {
      throw new HttpException('Seminarist not found', 705);
    }

    let founddortoir;
    if (dortoir) {
      founddortoir = await this.dortoirservice.findOneDortoir(dortoir);
      if (!founddortoir) {
        throw new HttpException('Dormitory not found', 702);
      }
      if (genreSemi && genreSemi !== founddortoir.genre) {
        throw new HttpException("The seminarist's gender does not match the dormitory", 703);
      }
    }

    const foundniveau = await this.niveauService.findOneNiveau(nomNiveau);
    if (!foundniveau) {
      throw new HttpException('niveau not found', 705);
    }

    // La catégorie est maintenant gérée par le front-end, pas de calcul automatique basé sur l'âge

    if (etatSante !== undefined) {
      if (etatSante !== 'Malade' && etatSante !== 'Autres') {
        updatedData.problemeSante = 'Ras';
      }
    }

    // Normalize update names to uppercase if provided
    if (updatedData.nomSemi) updatedData.nomSemi = updatedData.nomSemi.toUpperCase();
    if (updatedData.prenomSemi) updatedData.prenomSemi = updatedData.prenomSemi.toUpperCase();

    Object.assign(seminariste, {
      ...updatedData,
      age: age ?? seminariste.age,
      etatSante: etatSante ?? seminariste.etatSante,
      problemeSante: updatedData.problemeSante ?? seminariste.problemeSante,
      // si l'âge est fourni dans la mise à jour, recalculer la catégorie
      categorie: age !== undefined && age !== null ? this.computeCategory(age) : (updatedData.categorie ?? seminariste.categorie),
      nomdortoir: founddortoir ? founddortoir.nomDortoir : seminariste.nomdortoir,
      dortoir: founddortoir || seminariste.dortoir,
      genreSemi: genreSemi ?? seminariste.genreSemi,
      niveau:foundniveau || seminariste.niveau,
      nomNiveau:foundniveau.nomNiveau
    });

    await this.seminaristeRepository.save(seminariste);
    return seminariste;
  } catch (err) {
    throw err;
  }
}

// Delete
async deleteSeminariste(idSemi: string, user) {
  try {
    const seminaristeDelete = await this.seminaristeRepository.findOneBy({ idSemi });
    if (!seminaristeDelete) {
      throw new HttpException('Seminarist not found', 706);
    }
    // Autoriser les superadmins à supprimer des séminaristes
    if (!user?.isSuperAdmin && user?.rolePers !== CommissionEnum.ACCUEIL && user?.rolePers !== CommissionEnum.ADMINISTRATION && user?.rolePers !== CommissionEnum.FORMATION) {
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
    throw err
  }
}

// Find All
async findAll() {
  const seminaristes = await this.seminaristeRepository.find()

  return seminaristes;
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
      const genre = row.genre?.toLowerCase()
      const total = Number(row.total);
      if (data.hasOwnProperty(genre)) {
        data[genre] += total;
      }
      data.Total += total;
    });

    return data;
  } catch (err) {
    throw err
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
    throw err
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
    throw err
  }
}
}

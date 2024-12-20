import { Injectable, HttpException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { Niveau } from './entities/niveau.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommissionEnum } from 'generique/commission.enum';
import { SeminaristeEntity } from 'src/seminariste/entities/seminariste.entity';



@Injectable()
export class NiveauService {
  constructor(
    @InjectRepository(Niveau)
    private niveauRepo: Repository<Niveau>,

     @InjectRepository(SeminaristeEntity)
      private seminaristeRepository: Repository<SeminaristeEntity>,

    
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
        throw new HttpException("vous n'etes pas permis de le faire", 800);
      }

      const newNiveau = await this.niveauRepo.create({
        ...niveaudata,
        membreCo: user,
      });
      await this.niveauRepo.save(newNiveau);
      return newNiveau;
    } catch (err) {
       throw err
    }
  }

  // Find One Niveau
  async findOneNiveau(nomNiveau: string) {
    try {
      const niveau = await this.niveauRepo.findOneBy({ nomNiveau });
      if (!niveau) {
        throw new HttpException(`le niveau avec le nom ${nomNiveau} est introuvable`, 801);
      }
      return niveau;
    } catch (err) {
       throw err
    }
  }

  // Find All Niveaux
  async findAllNiveau() {
    try {
      const seminaristes = await this.seminaristeRepository.find()
      const niveaux:any = await this.niveauRepo.find();
      console.log(seminaristes)
  
      // Trier d'abord par "pepiniere", puis par ordre alphabétique des niveaux restants
      niveaux.sort((a, b) => {
        if (a.nomNiveau.toLowerCase() === 'pepiniere') return -1;
        if (b.nomNiveau.toLowerCase() === 'pepiniere') return 1;
        return a.nomNiveau.localeCompare(b.nomNiveau, undefined, { numeric: true });
      }).push({
        idniveau:"rfgh",
        nomNiveau:"Tous",
        seminariste:[...seminaristes]
      })


      
      return niveaux;
    } catch (err) {
       throw err
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
      return tab
    } catch (err) {
       throw err
    }
  }
}

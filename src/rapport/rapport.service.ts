import { Injectable, HttpException } from '@nestjs/common';
import { CreateRapportDto } from './dto/create-rapport.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rapport } from './entities/rapport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RapportService {
  constructor(
    @InjectRepository(Rapport)
    private rapportRepo: Repository<Rapport>,
  ) {}

  // Creation Rapport
  async creationRapport(createRapportDto: CreateRapportDto, user) {
    try {
      const { membreCo, ...rapportdata } = createRapportDto;
      const newRapport = await this.rapportRepo.create({
        ...rapportdata,
        membreCo: user,
      });
      await this.rapportRepo.save(newRapport);
      return newRapport;
    } catch (err) {
      throw err
    }
  }


  async getAll(user:any) {
    try {
      const rapports = await this.rapportRepo.find({
        where: { membreCo: { idpers: user.idComi } },
      });
      return rapports;
    } catch (err) {
      throw err
    }
  }



  async getById(idRapport:any) {
    try {
      const rapport = await this.rapportRepo.findOne({
        where: { idRapport },
      });
      return rapport;
    } catch (err) {
      throw err
    }
  }



}


  
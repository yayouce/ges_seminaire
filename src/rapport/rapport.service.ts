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
      throw new HttpException(`Error creating report: ${err.message}`, 701);
    }
  }}
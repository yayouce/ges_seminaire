import { BadRequestException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateDortoirDto } from './dto/create-dortoir.dto';
import { UpdateDortoirDto } from './dto/update-dortoir.dto';
import { Repository } from 'typeorm';
import { dortoirEntity } from './entities/dortoir.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionEnum } from 'generique/commission.enum';

@Injectable()
export class DortoirsService {
  constructor(
    @InjectRepository(dortoirEntity)
    private dortoirRepository: Repository<dortoirEntity>,
  ) {}

  async createDortoir(createDortoirDto: CreateDortoirDto, user) {
    const { membreCo, ...creation } = createDortoirDto;
    try {
      if (user?.rolePers !== CommissionEnum.ACCUEIL) {
        throw new UnauthorizedException("You are not authorized to create a dormitory.");
      }
      const newDortoir = this.dortoirRepository.create({
        ...creation,
        membreCo: user,
      });
      return await this.dortoirRepository.save(newDortoir);
    } catch (err) {
      throw new HttpException(`Error creating dormitory: ${err.message}`, 701);
    }
  }

  async findOneDortoir(nomDortoir: string) {
    try {
      const dortoir = await this.dortoirRepository.findOne({ where: { nomDortoir } });
      if (!dortoir) {
        throw new NotFoundException(`Dormitory with name ${nomDortoir} not found.`);
      }
      return dortoir;
    } catch (err) {
      throw new HttpException(`Error fetching dormitory: ${err.message}`, 702);
    }
  }

  async findDortoirListe() {
    try {
      return await this.dortoirRepository.find();
    } catch (err) {
      throw new HttpException(`Error fetching dormitory list: ${err.message}`, 703);
    }
  }

  async totalDortoirByType() {
    try {
      const result = await this.dortoirRepository
        .createQueryBuilder('dortoir')
        .select('dortoir.typedortoir', 'typedortoir')
        .addSelect('COUNT(*)', 'total')
        .groupBy('dortoir.typedortoir')
        .getRawMany();

      const consolidatedData: Record<string, number> = {
        seminariste: 0,
        co: 0,
        non_defini: 0,
      };

      result.forEach((row) => {
        const typedortoir = row.typedortoir.toLowerCase();
        consolidatedData[typedortoir] = Number(row.total);
      });

      return consolidatedData;
    } catch (err) {
      throw new HttpException(`Error fetching dormitory by type: ${err.message}`, 704);
    }
  }

  async totalDortoirByGenre() {
    try {
      const result = await this.dortoirRepository
        .createQueryBuilder('dortoir')
        .select('dortoir.genre', 'genre')
        .addSelect('COUNT(*)', 'total')
        .groupBy('dortoir.genre')
        .getRawMany();

      const consolidatedData: Record<string, number> = {
        pepiniere: 0,
        frere: 0,
        soeur: 0,
        non_defini: 0,
      };

      result.forEach((row) => {
        const genre = row.genre.toLowerCase();
        consolidatedData[genre] = Number(row.total);
      });

      return consolidatedData;
    } catch (err) {
      throw new HttpException(`Error fetching dormitory by genre: ${err.message}`, 705);
    }
  }

  async findAll() {
    try {
      return await this.dortoirRepository.find();
    } catch (err) {
      throw new HttpException(`Error fetching all dormitories: ${err.message}`, 706);
    }
  }
}

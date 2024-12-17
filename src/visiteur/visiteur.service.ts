import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateVisiteurDto } from './dto/create-visiteur.dto';
import { UpdateVisiteurDto } from './dto/update-visiteur.dto';
import { Repository } from 'typeorm';
import { Visiteur } from './entities/visiteur.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionEnum } from 'generique/commission.enum';

@Injectable()
export class VisiteurService {

  @InjectRepository(Visiteur)
  private visiteurRepository:Repository <Visiteur>

  async createNewVisiteur(createVisiteurDto: CreateVisiteurDto,user) {
    const {membreCo,...visiteurdata}=createVisiteurDto
    try{
      if(user?.rolePers!==CommissionEnum.ACCUEIL){
        throw new UnauthorizedException()
      }
      
      const newvisiteur = await this.visiteurRepository.create({
        ...visiteurdata,
        membreCo:user,
      })
    
      await  this.visiteurRepository.save(newvisiteur)

    }
    catch(err){
      throw new UnauthorizedException(err)
    }
  }

  async findAll() {
    return await this.visiteurRepository.find();
  }



 // Méthode pour trouver les visiteurs soft supprimés
 async findSoftDeletedVisiteurs(): Promise<Visiteur[]> {

  const softDeletedVisiteurs = await this.visiteurRepository
    .createQueryBuilder('visiteur')
    .where('visiteur.deletedAt IS NOT NULL') 
    .withDeleted() 
    .getMany();

  return softDeletedVisiteurs;
}


async updateVisiteur(idVisiteur: string, updateVisiteurDto: UpdateVisiteurDto, user) {
  const { membreCo, ...visiteurData } = updateVisiteurDto;

  // Vérifier le rôle de l'utilisateur
  if (user?.rolePers !== CommissionEnum.ACCUEIL) {
    throw new UnauthorizedException();
  }

 

  // Préparer l'objet à mettre à jour
  const updateVisiteur = await this.visiteurRepository.preload({
    idVisiteur,
    ...visiteurData
  });

  if (!updateVisiteur) {
    throw new NotFoundException(`Le visiteur avec l'ID ${idVisiteur} est introuvable`);
  }

  await this.visiteurRepository.save(updateVisiteur);

  return updateVisiteur;
}



////////////////////////Statistique///////////////////////////////////
//NombreTotal de visite par jour : 
async VisiteTotalParJour(): Promise<{ date: string; totalVisites: number; softDeletedVisites: number }[]> {
    const result = await this.visiteurRepository
      .createQueryBuilder('visiteur')
      .select('DATE(visiteur.createdAt)', 'date') // Extract only the date part of createdAt
      .addSelect('COUNT(*)', 'totalVisites') // Count all visits (active + deleted)
      .addSelect(
        'SUM(CASE WHEN visiteur.deletedAt IS NOT NULL THEN 1 ELSE 0 END)',
        'softDeletedVisites',
      )
      .withDeleted() 
      .groupBy('DATE(visiteur.createdAt)') 
      .orderBy('date', 'DESC') 
      .getRawMany(); 

    
    return result.map(row => ({
      date: row.date,
      totalVisites: Number(row.totalVisites),
      softDeletedVisites: Number(row.softDeletedVisites),
    }));
  }

  async VisiteTotalParJourParGenre(date: string): Promise<{ 
    date: string; 
    totalVisites: number; 
    genreVisiteur: Record<string, number>; }> {
    const result = await this.visiteurRepository
      .createQueryBuilder('visiteur')
      .select('DATE(visiteur.createdAt)', 'date') 
      .addSelect('visiteur.genreVisiteur', 'genre')
      .addSelect('COUNT(*)', 'total') 
      .withDeleted()
      .where('DATE(visiteur.createdAt) = :date', { date }) // Filter by date
      .groupBy('DATE(visiteur.createdAt)')
      .addGroupBy('visiteur.genreVisiteur')
      .getRawMany();
  
    const genreData: Record<string, number> = {
      frere: 0,
      soeur: 0,
      non_defini: 0,
    };
  
    let totalVisites = 0;
  

    result.forEach(row => {
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
  }
  
  async VisiteTotalParGenre(): Promise<{ 
    totalVisites: number; 
    genreVisiteur: Record<string, number>; 
  }> {
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
  
    result.forEach(row => {
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
  }
  














  //suppression d'un visiteur : il n'est plus présent
  async deleteVisiteur(idVisiteur:string,user){
    const visiteurtodelete = await this.visiteurRepository.findOneBy({idVisiteur})
    if(user?.rolePers!==CommissionEnum.ACCUEIL){
      throw new UnauthorizedException()
    }
        return await this.visiteurRepository.softDelete(idVisiteur)

    }

    


  
}

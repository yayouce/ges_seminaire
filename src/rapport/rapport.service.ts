import { Injectable } from '@nestjs/common';
import { CreateRapportDto } from './dto/create-rapport.dto';
import { UpdateRapportDto } from './dto/update-rapport.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rapport } from './entities/rapport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RapportService {
 constructor(
  @InjectRepository(Rapport)
  private rapportRepo : Repository<Rapport>
 ){}


async creationRapport(CreateRapportDto:CreateRapportDto,user){
  const {membreCo,...rapportdata}=CreateRapportDto


  const newrapport = await this.rapportRepo.create({
    ...rapportdata,
    membreCo:user,
    
  })
  await  this.rapportRepo.save(newrapport)

}


//-------------------------STAT-----------------------------------
// liste des rapports par commission

// async getRapportsByCommission(): Promise<{ commission: string; rapports: Rapport[] }[]> {
//   const rawData = await this.rapportRepo
//     .createQueryBuilder('rapport')
//     .leftJoinAndSelect('rapport.membreCo', 'membreCo')
//     .leftJoinAndSelect('membreCo.commission', 'commission')
//     .select([
//       'commission.libelleComi AS commission', // Correspond au champ dans CommissionEntity
//       'rapport.idRapport AS idRapport',
//       'rapport.libelleRapport AS libelleRapport',
//       'rapport.createdAt AS createdAt',
//       'rapport.updatedAt AS updatedAt',
//       'rapport.deletedAt AS deletedAt',
//     ])
//     .getRawMany();

//   // Regrouper les rapports par commission
//   const groupedData = rawData.reduce((acc, curr) => {
//     const { commission, ...rapportData } = curr;

//     // Vérifier si la clé commission existe
//     if (!acc[commission]) {
//       acc[commission] = [];
//     }

//     // Ajouter les données rapport, en les typant explicitement comme Rapport
//     acc[commission].push({
//       idRapport: rapportData.idRapport,
//       libelleRapport: rapportData.libelleRapport,
//       createdAt: rapportData.createdAt,
//       updatedAt: rapportData.updatedAt,
//       deletedAt: rapportData.deletedAt,
//     } as Rapport);

//     return acc;
//   }, {} as Record<string, Rapport[]>);

//   // Transformer en tableau avec la structure finale
//   return Object.entries(groupedData).map(([commission, rapports]) => ({
//     commission,
//     rapports,
//   }));
// }





}

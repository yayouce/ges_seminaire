import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { Repository } from 'typeorm';
import { CommissionEntity } from './entities/commission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';

@Injectable()
export class CommissionService {

constructor(
  @InjectRepository(CommissionEntity)
  private commissionRepository:Repository<CommissionEntity>,
 
){}

async findOne(membrecomi){

  const commission = await this.commissionRepository.findOne({
    where:{libelleComi: membrecomi},
  });

  return commission
}

  async createCommision(createCommission: CreateCommissionDto) {


   try{
     return await this.commissionRepository.save(createCommission)
    
    }
   catch(err){
    throw new ConflictException("la commission existe dejà!")
   }

  }

  //ajout de membre co dans la commission
  // async AjoutMembreCo(membrecomi){
  //   const {motPass,...object}=membrecomi


  //   const commission = await this.commissionRepository.findOne({
  //     where:{libelleComi: object},
  //   });

  //   await commission.membres.push(membrecomi)
  
  //   return commission
  // }


  async findByLibelle(libell){
return await this.commissionRepository.findOneBy(libell)
  }

  async findAllComi(){
    return await this.commissionRepository.find()
  }




  //_________________________STAT_________________________________
  async findTotalByGenderComi(){
    const commission = await this.commissionRepository.find()
    
    const tab = commission.map((dt:any)=>{
      const nbFrere = dt.membres.filter((m:any)=>m.genrePers === 'frere').length
      const nbSoeur = dt.membres.filter((m:any)=>m.genrePers === 'soeur').length
      return {
        commission: dt.libelleComi,
        total_frères: nbFrere,
        total_soeurs: nbSoeur,
        total_membres: dt.membres.length,
      }
    })
    return tab

  }


















  async mapCommissionWithMaterials() {
    try {
      // Fetch commissions and their members
      const commissions = await this.commissionRepository.find({
        relations: ['membres', 'membres.materiel'], // Ensure nested relations are fetched
      });

      // Map and calculate statistics
      const result = commissions.map((commission: any) => {
        // Flatten and filter materials by their status
        const rentedMaterials = commission.membres.flatMap((member: any) =>
          member.materiel.filter((material: any) => material.statut === 'Loue'),
        );
        const purchasedMaterials = commission.membres.flatMap((member: any) =>
          member.materiel.filter((material: any) => material.statut === 'achete'),
        );

        // Aggregate data
        const totalRented = rentedMaterials.reduce((sum, material: any) => sum + material.quantite, 0);
        const totalPurchased = purchasedMaterials.reduce((sum, material: any) => sum + material.quantite, 0);
        const totalMaterials = totalRented + totalPurchased;
        const totalSpent = [...rentedMaterials, ...purchasedMaterials].reduce(
          (sum, material: any) => sum + (material.cout || 0),
          0,
        );

        return {
          commission: commission.libelleComi, // Commission name
          materiels_loues: totalRented, // Total rented materials
          materiels_achete: totalPurchased, // Total purchased materials
          total_materiels: totalMaterials, // Total materials
          total_depense: totalSpent, // Total cost
        };
      });

      return result;
    } catch (err) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des données des commissions',
      );
    }
  }
  




  async listeMembreByCo(){
    const currentComi=await this.commissionRepository.find()
    const tab=currentComi.map((dt:any)=>{

 return{
    commission:dt.libelleComi,
    membres:dt.membres}
    })

    return tab
  }


  
}

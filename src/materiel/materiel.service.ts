import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';
import { CommissionEnum } from 'generique/commission.enum';
import { Repository } from 'typeorm';
import { Materiel } from './entities/materiel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { roleMembre } from 'generique/rolemembre.enum';

@Injectable()
export class MaterielService {


  constructor(
    @InjectRepository(Materiel)
    private materielRepo : Repository<Materiel>
   ){}
 
  async createMateriel(CreateMaterielDto: CreateMaterielDto,user) {
    const {membreCo,...creation} = CreateMaterielDto
  
      try{
  
        if(user?.roleMembre!==roleMembre.RESP){
          throw new UnauthorizedException()
        }
       
        const newMateriel= this.materielRepo.create({
  
          ...creation,
          membreCo : user
        }
        )
       this.materielRepo.save(newMateriel)
      }
      catch(err){
        throw new UnauthorizedException(`vous n'êtes pas habilité à le faire!!`)
      }
    }



    async updateMateriel(
      idMateriel: string,
      updateMaterielDto: UpdateMaterielDto,
      user: any
    ) {
      const { membreCo, ...creation } = updateMaterielDto;
    
      // Vérification du rôle de l'utilisateur
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new UnauthorizedException(
          "Vous n'avez pas l'autorisation de mettre à jour ce matériel."
        );
      }
    
      // Vérifier l'existence du matériel
      const matl = await this.getOneMateriel(idMateriel);
      if (!matl) {
        throw new NotFoundException(`Le matériel avec l'ID : ${idMateriel} est introuvable.`);
      }
    
    
      // Précharger les données pour la mise à jour
      const updateMateriel = await this.materielRepo.preload({
        idMateriel,
        ...creation,
      });
    
      if (!updateMateriel) {
        throw new NotFoundException(`Impossible de charger le matériel avec l'ID : ${idMateriel}.`);
      }
    
      if (user.rolePers !== matl.membreCo.rolePers) {
      
        throw new UnauthorizedException("Ce matériel ne vous appartient pas!");
      }
    
      return await this.materielRepo.save(updateMateriel);
    }




    async getOneMateriel(idMateriel){
      return await this.materielRepo.findOneBy({idMateriel})
    }

    async deleteMateriel(idMateriel: string, user: any) {
    
      const materielToDelete = await this.materielRepo.findOneBy({ idMateriel });
      if (!materielToDelete) {
        throw new NotFoundException(`Le matériel avec l'ID : ${idMateriel} est introuvable.`);
      }
    
      if (user?.roleMembre !== roleMembre.RESP) {
        throw new UnauthorizedException("seul le responsable peut supprimer");
      }

      if (user?.rolePers !== materielToDelete.membreCo?.rolePers) {
        throw new UnauthorizedException("Vous n'avez pas l'autorisation de supprimer ce matériel. Car ce n'est pas le votre!");
      }


    
      return await this.materielRepo.softDelete(idMateriel);
    }






















    //______________________________________STAT___________________________________________
    async getStatisticsByCommission(user) {
      try {
        // if (user?.roleMembre !== roleMembre.RESP) {
        //   throw new UnauthorizedException("Vous n'êtes pas habilité à accéder à cette ressource.");
        // }
    
        const materiels = await this.materielRepo.find({
          where: { membreCo: { idpers: user.idComi } },
        });
    
        // Calculer les statistiques
        const loues = materiels.filter(m => m.statut === "Loue").length;
        const achetes = materiels.filter(m => m.statut === "achete").length;
        const totalDepenses = materiels.reduce((sum, m) => sum + Number(m.cout || 0), 0);
    
        return {
          loues,
          achetes,
          totalDepenses,
        };
      } catch (err) {
        throw new InternalServerErrorException("Erreur lors de la récupération des statistiques.");
      }
    }
    

}

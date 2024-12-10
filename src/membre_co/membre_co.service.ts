import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMembreCoDto } from './dto/create-membre_co.dto';
import { UpdateMembreCoDto } from './dto/update-membre_co.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MembreCoEntity } from './entities/membre_co.entity';
import { Repository } from 'typeorm';
import { CommissionEntity } from 'src/commission/entities/commission.entity';
import { CommissionService } from 'src/commission/commission.service';
import * as bcrypt from "bcrypt"
import { responsabilite } from 'generique/responsabilite.enum';
import { roleMembre } from 'generique/rolemembre.enum';
import { CommissionEnum } from 'generique/commission.enum';

const saltOrRounds = 10
@Injectable()
export class MembreCoService {
  seminaristeRepository: any;
  constructor(
    @InjectRepository(MembreCoEntity)
    private membreRepository : Repository<MembreCoEntity>,
    private commissionService:CommissionService
 
)
{}


async findOne(phone){
 return await this.membreRepository.findOne({
  where: { phonePers: phone },
})
}


//membreCo par commission

async membreCoParcomi(){
  const result =await this.membreRepository
  .createQueryBuilder('membreco')
  .select("*")
  .groupBy('membreco.rolePers')
  .getRawMany();
  
  return result
}


async createMembreCo(createmembreco:CreateMembreCoDto,user){
  

  if(user?.roleMembre!==roleMembre.RESP){
  throw new UnauthorizedException()
}
  const commission = await this.commissionService.findOne(createmembreco.commission);

  if(!commission){
    throw new HttpException({
      statusCode:801,
      error:"date non prise en compte format (YYYY-MM-DD)"
    },
  801
  )
 
  }
  createmembreco.rolePers = commission.libelleComi



  if(user.rolePers!==createmembreco.rolePers && user.rolePers!==CommissionEnum.ADMINISTRATION){
    throw new NotFoundException("N'\est pas de votre commission!")
  }
  
  const hashedpassword =await  bcrypt.hash(createmembreco.motPass,saltOrRounds)
  
  const membreCo=this.membreRepository.create({
    ...createmembreco,
    rolePers:commission.libelleComi,
    motPass:hashedpassword,
    commission
  })
return this.membreRepository.save(membreCo) 
}









//suppimer
async deleteMembreCo(idpers:string,user){
  const membreDelete = await this.membreRepository.findOneBy({idpers})
  if(!membreDelete){
    throw new NotFoundException("membre non trouvé")
  }
  if(user?.rolePers!==CommissionEnum.ACCUEIL && user?.rolePers!==CommissionEnum.ADMINISTRATION){
    throw new UnauthorizedException()
  }
      return await this.seminaristeRepository.softDelete(idpers)

  }


  //mise à jour

  async updateMembre(
    idpers: string,
    updateMembreCoDto: UpdateMembreCoDto,
    user
  ) {
  
    if (user?.roleMembre !== roleMembre.RESP) {
      throw new UnauthorizedException('vous n\'êtes pas responsable');
    }
    const membre = await this.membreRepository.findOne({
      where: { idpers },
      relations: ['commission'],
    });
  
    if (!membre) {
      throw new NotFoundException(`Le membre avec l'ID ${idpers} est introuvable`);
    }
  
    // Si une commission est fournie dans le DTO, la valider
    let commission = membre.commission;
    if (updateMembreCoDto.commission) {
      commission = await this.commissionService.findOne(updateMembreCoDto.commission);
      if (!commission) {
        throw new NotFoundException(`Commission avec l'ID ${updateMembreCoDto.commission} introuvable`);
      }
      updateMembreCoDto.rolePers = commission.libelleComi;
    }
  
   
    if (user.rolePers !== CommissionEnum.ADMINISTRATION && user.rolePers !== CommissionEnum.ACCUEIL ) {
      throw new UnauthorizedException("Vous n'avez pas les droits pour mettre à jour ce membre");
    }
  
    
  
  
    const updatedMembre = await this.membreRepository.preload({
      idpers,
      ...updateMembreCoDto,
      commission,
    });
  
    if (!updatedMembre) {
      throw new NotFoundException(`Impossible de précharger les données pour le membre ${idpers}`);
    }
  
   
    return this.membreRepository.save(updatedMembre);
  }
  

async getmembreco(){
  return await this.membreRepository.find()
}

async getPco(){
  return await this.membreRepository.findBy({rolePers:"Pco"})
}



//___________________________STAT____________________________________


//total membreco par commission et par genre
async membreCoByGender(): Promise<Record<string, Record<string, number>>> {
  const result = await this.membreRepository
    .createQueryBuilder('membreco')
    .select('membreco.genrePers', 'genre')
    .addSelect('membreco.rolePers', 'commission')
    .addSelect('COUNT(*)', 'total') 
    .groupBy('membreco.rolePers')
    .addGroupBy('membreco.genrePers')
    .getRawMany(); 


  const groupedData: Record<string, Record<string, number>> = {};

  result.forEach(row => {
    const commission = row.commission;
    const genre = row.genre.toLowerCase();
    const total = Number(row.total);

    if (!groupedData[commission]) {
      groupedData[commission] = {commission:commission, frere: 0, soeur: 0, Total: 0 };
    }

    groupedData[commission][genre] = total;
    groupedData[commission].Total += total; 
  });


  Object.keys(groupedData).forEach(commission => {
    if (!groupedData[commission].frere) {
      groupedData[commission].frere = 0;
    }
    if (!groupedData[commission].soeur) {
      groupedData[commission].soeur = 0;
    }
  });

  return groupedData;
}
async membreCoTotalByGender() {
  const result = await this.membreRepository
    .createQueryBuilder('membreco')
    .select('membreco.genrePers', 'genre')
    .addSelect('COUNT(*)', 'total')
    .groupBy('membreco.genrePers')
    .getRawMany();


  const consolidatedData: Record<string, number> = {
    frere: 0,
    soeur: 0,
    non_defini: 0,
  };

  result.forEach(row => {
    const genre = row.genre || 'non_defini';
    if (consolidatedData.hasOwnProperty(genre)) {
      consolidatedData[genre] = Number(row.total);
    }
  });

  return consolidatedData;
}

async findTotalByGenderFormateur() {
  const result = await this.membreRepository
  .createQueryBuilder('membreco')
  .select('membreco.genrePers', 'genre')
  .addSelect('COUNT(*)', 'total')
  .where('membreco.rolePers = :role', { role: 'Formation' })
  .groupBy('membreco.genrePers')
  .getRawMany();

const consolidatedData: Record<string, number> = {
  frere: 0,
  soeur: 0,
  non_defini: 0,
};

result.forEach(row => {
  const genre = row.genre || 'non_defini';
  if (consolidatedData.hasOwnProperty(genre)) {
    consolidatedData[genre] = Number(row.total);
  }
});

return consolidatedData;


  
}



  
}

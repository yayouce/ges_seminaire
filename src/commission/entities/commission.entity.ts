import { CommissionEnum } from "generique/commission.enum";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity('commission')
export class CommissionEntity {
  
    @PrimaryGeneratedColumn("uuid")
    idComi :string;
    
    @OneToMany(()=>MembreCoEntity,(membre)=>membre.commission)
    membres:MembreCoEntity[]
    @Column({
        type:"enum",
        enum:CommissionEnum,
        unique:true
    })
    libelleComi : string;
   
}

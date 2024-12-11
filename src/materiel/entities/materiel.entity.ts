import { StatutMaterielEnum } from "generique/StatutMaterielEnum.enum";
import { TimestampEntites } from "generique/timestamp";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

 @Entity('materiel')
export class Materiel extends TimestampEntites {

    @PrimaryGeneratedColumn('uuid')
    idMateriel:string
    @Column()
    designation:string;
    @Column()
    quantite:Number
    @Column(
        {
            type:"enum",
            enum:StatutMaterielEnum,
            default:StatutMaterielEnum.NON_SPECIFIE
        }
    )
    statut:string;
    @Column({type:"date"})
    date:Date;

    @Column()
    lieu:string

    @Column()
    cout:Number

    @ManyToOne(()=>MembreCoEntity,(membreco)=>membreco.materiel)
    membreCo:MembreCoEntity

}

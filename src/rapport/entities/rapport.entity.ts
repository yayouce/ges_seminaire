import { TimestampEntites } from "generique/timestamp";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity("rapport")
export class Rapport extends TimestampEntites {

    @PrimaryColumn('uuid')
    idRapport:string

    @Column()
    libelleRapport:string

    @ManyToOne(()=>MembreCoEntity,(membreco)=>membreco.rapport,{eager:true})
    membreCo:MembreCoEntity

    
}

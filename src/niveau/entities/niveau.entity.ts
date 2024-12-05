import { TimestampEntites } from "generique/timestamp";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { Column, Entity, ManyToOne } from "typeorm";
Entity('niveau')
export class Niveau extends TimestampEntites {
    @Column()
    nomNiveau:string;
    // @ManyToOne(()=>MembreCoEntity,(membreco)=>membreco.niveau,{eager:true})
    // membreCo:MembreCoEntity                                                            
}

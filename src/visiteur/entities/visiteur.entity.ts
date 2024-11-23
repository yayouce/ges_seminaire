
import { TimestampEntites } from "generique/timestamp";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { personne } from "src/personne/entities/personne.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('visiteur')
export class Visiteur extends TimestampEntites {

    @PrimaryGeneratedColumn("uuid")
    idVisiteur:string;

    @Column()
    nomVisiteur: string;
    @Column()
    pernomVisiteur:string;
    @Column()
    genreVisiteur:string
    @Column()
    phoneVisiteur:string;
 
    @Column()
    roleVisiteur:string // role dans son sous-comité
    @Column()
    sousComite:string
    @ManyToOne(()=>MembreCoEntity,(membreco)=>membreco.visiteur,{eager:true})
    membreCo:MembreCoEntity

}


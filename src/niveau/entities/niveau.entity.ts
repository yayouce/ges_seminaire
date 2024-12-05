import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { SeminaristeEntity } from "src/seminariste/entities/seminariste.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('niveau')
export class Niveau {
    @PrimaryGeneratedColumn("uuid")
    idniveau:string;

    @Column()
    nomNiveau:string;


    @ManyToOne(()=>MembreCoEntity,(membreco)=>membreco.rapport,{eager:true})
    membreCo:MembreCoEntity

    @OneToMany(()=>SeminaristeEntity,(seminariste)=>seminariste.niveau,{eager:true})
    seminariste:SeminaristeEntity[]
}

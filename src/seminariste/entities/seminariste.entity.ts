
import { TimestampEntites } from "generique/timestamp";
import { dortoirEntity } from "src/dortoirs/entities/dortoir.entity";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { personne } from "src/personne/entities/personne.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("seminariste")
export class SeminaristeEntity extends TimestampEntites{
    @PrimaryGeneratedColumn('uuid')
    idSemi:string
    @Column()
    nomSemi:string;
    @Column()
    prenomSemi:string;
    @Column()
    age:number;

    @Column()
    categorie:string;
    @Column()
    genreSemi:string;
    @Column() //un seminariste peut avoir plusieurs aiutres seminariste sous sa charge
    phoneSemi:string
    @Column({
        default:true //sur le camps
    })
    situation:boolean
    @Column()
    sousComite:string
    @Column()
    numUrgence:string
  
    @ManyToOne(()=>dortoirEntity,(dortoir)=>dortoir.seminaristes)
    dortoir:dortoirEntity
    @Column()
    nomdortoir:string
    @ManyToOne(()=>MembreCoEntity,(membreco)=>membreco.seminariste,{eager:true})
    membreCo:MembreCoEntity

    @Column()
    niveau:string
}

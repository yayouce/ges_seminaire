
import { categorieSem } from "generique/categorieSeminariste.enum";
import { genreEnum } from "generique/genre.enum";
import { NiveauEnum } from "generique/niveau.enum";
import { etatSanteEnum} from "generique/sante.enum";
import { situation } from "generique/situation.enum";
import { TimestampEntites } from "generique/timestamp";
import { dortoirEntity } from "src/dortoirs/entities/dortoir.entity";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { Niveau } from "src/niveau/entities/niveau.entity";
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


    @Column({
        type:"enum",
        enum:categorieSem,
        default:categorieSem.NON_SPECIFIE
    })
    categorie:string;
    @Column({
        type:"enum",
        enum:genreEnum,
        default:genreEnum.NON_DEFINI
    })
    genreSemi:string;
    @Column() 
    phoneSemi:string
    @Column({
        type:"enum",
        enum:situation,
        default:situation.NON_SPECIFIE
    })
    situation:string
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

    // @Column({
    //     type:"enum",
    //     enum:NiveauEnum,
    //     default:NiveauEnum.NON_SPECIFIE
    // })
    // niveau:string
    @Column({
        type:"enum",
        enum:etatSanteEnum,
        default:etatSanteEnum.NON_SPECIFIE
    })
    etatSante:string
    @Column()
    problemeSante:string


    @ManyToOne(()=>Niveau,(niveau)=>niveau.seminariste,{eager:true})
    niveau:dortoirEntity
}

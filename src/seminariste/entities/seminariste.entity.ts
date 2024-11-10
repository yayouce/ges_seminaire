
import { dortoirEntity } from "src/dortoirs/entities/dortoir.entity";
import { personne } from "src/personne/entities/personne.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("seminariste")
export class SeminaristeEntity extends personne {
    @PrimaryGeneratedColumn('uuid')
    idDortoir:string
    @Column()
    numUrgence:string;
    
    @Column()
    categorie:string
    
    
    
    @ManyToOne(()=>dortoirEntity,(dortoir)=>dortoir.seminaristes)
    dortoir: string;
   
}

import { typeDortoir } from "generique/typedortoir.enum";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";
import { SeminaristeEntity } from "src/seminariste/entities/seminariste.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity('dortoir')
export class dortoirEntity {

    @PrimaryGeneratedColumn("uuid")
    idDortoir :string;
    @Column()
    nomDortoir:string;
    @Column()
    nbPlace :number;
    @Column()
    genre:string;

    @Column(
        {type:"enum",
        enum:typeDortoir,
        default:typeDortoir.NON_DEFINI
        }
    )
    typedortoir:string

 
    @OneToMany(()=>SeminaristeEntity, (seminariste)=>seminariste.dortoir,{eager:true})
    seminaristes:SeminaristeEntity[]
    
   
    @ManyToOne(()=>MembreCoEntity, (membreco)=>membreco.dortoir)
    membreCo:MembreCoEntity
}

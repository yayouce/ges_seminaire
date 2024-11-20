
import { responsabilite } from "generique/responsabilite.enum";
import { roleMembre } from "generique/rolemembre.enum";
import { CommissionEntity } from "src/commission/entities/commission.entity";
import { dortoirEntity } from "src/dortoirs/entities/dortoir.entity";
import { personne } from "src/personne/entities/personne.entity";
import { SeminaristeEntity } from "src/seminariste/entities/seminariste.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("membreco")
export class 

MembreCoEntity extends personne {


@ManyToOne(()=>CommissionEntity,(commission)=>commission.membres)
commission:CommissionEntity;
@Column({
    type:"enum",
    enum:roleMembre,
    default:roleMembre.SIMPLE,
})
roleMembre:string

@OneToMany(()=>SeminaristeEntity,(seminariste)=>seminariste.membreCo)
seminariste:SeminaristeEntity[]

@OneToMany(()=>dortoirEntity,(dortoir)=>dortoir.membreCo)
dortoir:dortoirEntity[]

}

import { responsabilite } from "generique/responsabilite.enum";
import { roleMembre } from "generique/rolemembre.enum";
import { CommissionEntity } from "src/commission/entities/commission.entity";
import { dortoirEntity } from "src/dortoirs/entities/dortoir.entity";
import { Niveau } from "src/niveau/entities/niveau.entity";
import { personne } from "src/personne/entities/personne.entity";
import { Rapport } from "src/rapport/entities/rapport.entity";
import { SeminaristeEntity } from "src/seminariste/entities/seminariste.entity";
import { Visiteur } from "src/visiteur/entities/visiteur.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("membreco")
export class MembreCoEntity extends personne {


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

@OneToMany(()=>Visiteur,(visiteur)=>visiteur.membreCo)
visiteur:Visiteur[]


@OneToMany(()=>Rapport,(rapport)=>rapport.membreCo)
rapport:Rapport[]


// @OneToMany(()=>Niveau,(niveau)=>niveau.membreCo)
// niveau:Niveau[]
}
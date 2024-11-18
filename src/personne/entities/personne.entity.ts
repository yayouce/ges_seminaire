import { CommissionEnum } from "generique/commission.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('personne')
export class personne{
@PrimaryGeneratedColumn("uuid")
idpers:string;
@Column()
motPass:string;

@Column()
nomPers: string;
@Column()
pernomPers:string;
@Column()
genrePers:string
@Column({unique:true})
phonePers:string;
@Column()
situation:boolean
@Column({
    type:"enum",
    enum:CommissionEnum
})
rolePers:string
@Column()
sousComite:string
}
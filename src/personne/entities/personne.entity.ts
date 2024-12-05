import { CommissionEnum } from "generique/commission.enum";
import { genreEnum } from "generique/genre.enum";
import { situation } from "generique/situation.enum";
import { TimestampEntites } from "generique/timestamp";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('personne')
export class personne extends TimestampEntites{
    @PrimaryGeneratedColumn("uuid")
idpers:string;
@Column()
motPass:string;

@Column()
nomPers: string;
@Column()
pernomPers:string;
@Column({
    type:"enum",
    enum:genreEnum,
    default:genreEnum.NON_DEFINI
})
genrePers:string
@Column({unique:true})
phonePers:string;
@Column({
    type:"enum",
    enum:situation,
    default:situation.NON_SPECIFIE
})
situation:string
@Column({
    type:"enum",
    enum:CommissionEnum
})
rolePers:string
@Column()
sousComite:string
}
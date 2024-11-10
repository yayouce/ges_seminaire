import { SeminaristeEntity } from "src/seminariste/entities/seminariste.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

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

    @OneToMany(()=>SeminaristeEntity, (seminariste)=>seminariste.dortoir)
    seminaristes:SeminaristeEntity[]
}

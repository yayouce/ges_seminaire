
import { personne } from "src/personne/entities/personne.entity";
import { Column, Entity } from "typeorm";

@Entity('visiteur')
export class Visiteur extends personne {

    @Column()
    dateEntr: Date;
    @Column()
    dateSorti:Date;
}

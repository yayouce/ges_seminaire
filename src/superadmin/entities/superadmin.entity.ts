import { TimestampEntites } from "generique/timestamp";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('superadmin')
export class Superadmin extends TimestampEntites {

    @PrimaryGeneratedColumn('uuid')
    idSupAdmin: string;

    @Column()
    loginSupAdmin: string;

    @Column()
    motPassSupAdmin: string;

}

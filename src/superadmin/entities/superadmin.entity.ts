import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('superadmin')
export class Superadmin {


@PrimaryGeneratedColumn('uuid')
    idSupAdmin:string;
    @Column()
    loginSupAdmin:string;
    @Column()
    motPassSupAdmin:string
}

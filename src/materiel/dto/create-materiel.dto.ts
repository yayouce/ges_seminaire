import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMaterielDto {
    @IsString()
    designation:string;
    @IsNumber()
    quantite:Number

    @IsString()
    statut:string;
    @IsDate()
    date:Date;

    @IsString()
    lieu:string

    @IsNumber()
    cout:Number

    @IsOptional()
    @IsString()
    membreCo:string
}

import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateSeminaristeDto {
 
    @IsString()
    nomSemi_prenom:string;
    @IsString()
    categorie:string;  //pepinière,enfant, jeune, adulte ...
    @IsString()
    genreSemi:string;
    @IsString()
    phoneSemi:string

    @IsNumber()
    age:number
    
    @IsString()
    sousComite:string
    @IsString()
    numUrgence:string
    @IsString()
    dortoir:string
    @IsString()
    membreCo:string
    
}

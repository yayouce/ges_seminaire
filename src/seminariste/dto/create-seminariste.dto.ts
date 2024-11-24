import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSeminaristeDto {
 
    @IsString()
    nomSemi:string;
    @IsString()
    prenomSemi:string;
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


    @IsOptional()
    @IsString()
    niveau:string
    
}

import { IsString } from "class-validator";

export class CreateSeminaristeDto {
 
    @IsString()
    nomSemi:string;
    @IsString()
    categorie:string;  //pepinière,enfant, jeune, adulte ...
    @IsString()
    prenomSemi:string;
    @IsString()
    genreSemi:string;
    @IsString()
    phoneSemi:string
    
    @IsString()
    sousComite:string
    @IsString()
    numUrgence:string
    @IsString()
    dortoir:string
}

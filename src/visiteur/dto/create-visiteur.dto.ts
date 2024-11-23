import { IsString } from "class-validator";

export class CreateVisiteurDto {



    @IsString()
    nomVisiteur: string;
    @IsString()
   
    pernomVisiteur:string;
    @IsString()
    genreVisiteur:string
    @IsString()
    phoneVisiteur:string;
 
    roleVisiteur:string // role dans son sous-comité
    @IsString()
    sousComite:string

    @IsString()
    membreCo:string
 

}

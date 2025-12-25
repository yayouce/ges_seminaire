import { IsOptional, IsString } from "class-validator";

export class CreateVisiteurDto {



    @IsString()
    nomVisiteur: string;
    @IsString()
   
    pernomVisiteur:string;
    @IsString()
    genreVisiteur:string
    @IsString()
    phoneVisiteur:string;
    @IsString()
    roleVisiteur:string // role dans son sous-comité
    @IsString()
    sousComite:string

    @IsOptional()
    @IsString()
    membreCo:string
 

}

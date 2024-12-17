import { IsString } from "class-validator";

export class CreateRapportDto {
    @IsString()
    libelleRapport:string
    @IsString()
    tacheRealisees:string
    @IsString()
    commentaires:string
    @IsString()
    tachesNonRealisees:string
    @IsString()
    causes:string
    @IsString()
    difficultes:string
    @IsString()
    suggestions:string
    @IsString()
    infoSuplementaire:string

    @IsString()
    membreCo:string
}

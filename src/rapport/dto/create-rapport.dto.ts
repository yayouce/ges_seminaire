import { IsString } from "class-validator";

export class CreateRapportDto {
    @IsString()
    libelleRapport:string

    @IsString()
    membreCo:string
}

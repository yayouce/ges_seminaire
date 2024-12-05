import { IsString } from "class-validator";

export class CreateNiveauDto {
    @IsString()
    nomNiveau:string;


    
    @IsString()
    membreCo:string;
}

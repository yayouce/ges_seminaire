import { IsOptional, IsString } from "class-validator";

export class CreateNiveauDto {
    @IsString()
    nomNiveau:string;

    @IsOptional()
    @IsString()
    membreCo:string;
}

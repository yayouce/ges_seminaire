import { IsNotEmpty, IsNumber, isString, IsString, IsOptional } from "class-validator";

export class CreateDortoirDto {

    @IsNotEmpty()
    @IsString()
    nomDortoir:string;
    @IsNumber()
    nbPlace :number;
    @IsString()
    genre:string;
    @IsString()
    typedortoir:string 

    @IsOptional()
    @IsString()
    membreCo?:string
}


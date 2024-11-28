import { IsNotEmpty, IsNumber, isString, IsString } from "class-validator";

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

    @IsString()
    membreCo:string
}


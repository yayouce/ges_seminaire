import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateSeminaristeDto } from './create-seminariste.dto';
import { Type } from 'class-transformer';

export class UpdateSeminaristeDto extends PartialType(CreateSeminaristeDto) {

        @IsOptional()
        @IsString()
        nomSemi_prenom:string;
        @IsOptional()
        @IsString()
        categorie:string;  //pepinière,enfant, jeune, adulte ...
        @IsOptional()
        @IsString()
        genreSemi:string;
        @IsOptional()
        @IsString()
        phoneSemi:string;
        @IsOptional()
        @IsNumber()
        age:number
        @IsOptional()
        @IsString()
        sousComite:string;
        @IsOptional()
        @IsString()
        numUrgence:string;
        @IsOptional()
        @IsString()
        dortoir:string;
        @IsOptional()
        @IsString()
        membreCo:string

        @IsOptional()
        @IsString()
        niveau:string
        
    }
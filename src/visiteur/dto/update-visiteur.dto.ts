import { PartialType } from '@nestjs/mapped-types';
import { CreateVisiteurDto } from './create-visiteur.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVisiteurDto extends PartialType(CreateVisiteurDto) {
    
        @IsString()
        @IsOptional()
        nomVisiteur: string;
        @IsOptional()
        @IsString()
        pernomVisiteur:string;
        @IsString()
        @IsOptional()
        genreVisiteur:string
        @IsOptional()
        @IsString()
        phoneVisiteur:string;
        @IsOptional()
        @IsString()
     
        roleVisiteur:string // role dans son sous-comité
        @IsOptional()
        @IsString()
        sousComite:string
        @IsOptional()
        @IsString()
        membreCo:string
     
}

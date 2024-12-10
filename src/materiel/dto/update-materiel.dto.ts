import { PartialType } from '@nestjs/swagger';
import { CreateMaterielDto } from './create-materiel.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMaterielDto extends PartialType(CreateMaterielDto) {


    @IsOptional()
    @IsString()
    designation:string;
    @IsOptional()
    @IsNumber()
    quantite:Number

    @IsOptional()
    @IsString()
    statut:string;
    @IsOptional()
    @IsDate()
    date:Date;

    @IsOptional()
    @IsString()
    lieu:string

    @IsOptional()
    @IsNumber()
    cout:Number

    @IsOptional()
    @IsString()
    membreCo:string
}

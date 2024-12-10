import { PartialType } from '@nestjs/mapped-types';
import { CreateDortoirDto } from './create-dortoir.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDortoirDto extends PartialType(CreateDortoirDto) {

@IsOptional()
    @IsString()
    nomDortoir:string;
    @IsOptional()
    @IsNumber()
    nbPlace :number;
    @IsOptional()
    @IsString()
    genre:string;
    @IsOptional()
    @IsString()
    typedortoir:string 

    @IsOptional()
    @IsString()
    membreCo:string

    @IsOptional()
    @IsString()
    seminaristes:string
}

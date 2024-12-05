import { PartialType } from '@nestjs/mapped-types';
import { CreateMembreCoDto } from './create-membre_co.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMembreCoDto extends PartialType(CreateMembreCoDto) {
    @IsString()
commission
@IsString()
motPass:string
@IsString()
nomPers: string;
@IsString()
pernomPers:string;
@IsString()
genrePers:string
@IsString()
phonePers:string;
@IsString()
situation:string
@IsString()
rolePers:string
@IsString()
sousComite:string 
@IsString()
roleMembre:string
}

import { IsNotEmpty, IsString } from "class-validator"

export class CreateMembreCoDto {
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
situation:boolean
@IsString()
rolePers:string
@IsString()
sousComite:string 

@IsNotEmpty()
@IsString()
roleMembre:string
}

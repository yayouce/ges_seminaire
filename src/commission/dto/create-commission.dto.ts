import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { MembreCoEntity } from "src/membre_co/entities/membre_co.entity";

export class CreateCommissionDto {

 
   
    @IsNotEmpty()
    @IsArray() //Valide que membres est bien un tableau.
    @ValidateNested({ each: true }) //Indique que chaque élément du tableau doit être validé selon les règles de l'entité MembreCoEntity
    @Type(() => MembreCoEntity) //Transforme chaque élément du tableau en instance de MembreCoEntity, ce qui permet une validation en profondeur de chaque membre du tableau.
    membres:MembreCoEntity[]=[] //par defaut il initialise en une liste vide
    @IsNotEmpty()
    @IsString()
    
    libelleComi : string;
   
}   

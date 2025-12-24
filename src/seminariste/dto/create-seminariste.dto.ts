import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSeminaristeDto {

    @ApiProperty({
      description: 'Matricule du séminariste au format IKH-XXXX (ex: 20 devient IKH-0020, 300 devient IKH-0300)',
      example: '20',
    })
    @IsString()
    matricule:string;

    @ApiProperty({
      description: 'Nom du séminariste',
      example: 'Diarra',
    })
    @IsString()
    nomSemi:string;

    @ApiProperty({
      description: 'Prénom du séminariste',
      example: 'Yaya',
    })
    @IsString()
    prenomSemi:string;

    // @ApiProperty({
    //   description: 'Catégorie du séminariste (définie par le front-end)',
    //   example: 'Jeunes_et_adultes',
    //   enum: ['Pepinieres', 'Enfants', 'Jeunes_et_adultes', 'Non_specifie']
    // })
    // @IsString()
    // categorie:string;

    @ApiProperty({
      description: 'Genre du séminariste',
      example: 'frere',
      enum: ['frere', 'soeur']
    })
    @IsString()
    genreSemi:string;

    @ApiProperty({
      description: 'Numéro de téléphone du séminariste',
      example: '+221701234567',
    })
    @IsString()
    phoneSemi:string;

    @ApiProperty({
      description: 'Âge du séminariste',
      example: 25,
    })
    @IsNumber()
    age:number;

    @ApiProperty({
      description: 'Sous-comité du séminariste',
      example: 'Comité A',
    })
    @IsString()
    sousComite:string;

    @ApiProperty({
      description: 'Numéro d\'urgence',
      example: '+221771234567',
    })
    @IsString()
    numUrgence:string;

    @ApiProperty({
      description: 'ID du dortoir',
      example: 'uuid-dortoir',
    })
    @IsString()
    dortoir:string;

    @ApiProperty({
      description: 'ID du membre de commission',
      example: 'uuid-membre',
    })
    @IsOptional()
    @IsString()
    membreCo:string;

    @ApiPropertyOptional({
      description: 'Niveau du séminariste',
      example: 'uuid-niveau',
    })
    
    @IsOptional()
    @IsString()
    niveau:string;

    @ApiProperty({
      description: 'État de santé du séminariste',
      example: 'Bon',
      enum: ['Bon', 'Malade', 'Autres', 'Non_specifie']
    })
    @IsString()
    etatSante:string;

    @ApiPropertyOptional({
      description: 'Problème de santé éventuel',
      example: 'Ras',
    })
    @IsString()
    @IsOptional()
    problemeSante:string;

    @ApiPropertyOptional({
      description: 'Nom du niveau',
      example: 'Niveau 1',
    })
    @IsOptional()
    @IsString()
    nomNiveau:string;
}

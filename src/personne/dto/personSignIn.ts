import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class personSigninDto {

  @ApiProperty({
    description: 'Numéro de téléphone du membre',
    example: '+221701234567',
  })
  @IsString()
  phonePers:string;

  @ApiProperty({
    description: 'Mot de passe du membre',
    example: 'password123',
  })
  @IsString()
  motPass:string;
}

import { IsString } from "class-validator";

export class personSigninDto {


@IsString()
phonePers:string;
@IsString()
motPass:string; 
}

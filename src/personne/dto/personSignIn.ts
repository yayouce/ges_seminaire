import { IsString } from "class-validator";

export class personSigninDto {


@IsString()
loginPers:string;
@IsString()
motPass:string; 
}

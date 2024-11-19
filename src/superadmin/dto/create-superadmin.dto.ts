import { IsString } from "class-validator";

export class CreateSuperadminDto {
    @IsString()
    loginSupAdmin:string;
    @IsString()
    motPassSupAdmin:string
}

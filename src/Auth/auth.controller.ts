import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { personSigninDto } from 'src/personne/dto/personSignIn';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

// @Post('signup')
// async Signup(@Body() userCreate){
// return this.authService.signUp(userCreate)
// }



@Post('signIn')
async SignIn(@Body() usersignIn:personSigninDto){
    return await this.authService.signIn(usersignIn)
}

// @UseGuards(AuthGuard)
@Get("getuser")
async getUser(){
    return await this.authService.getuser()
}
}


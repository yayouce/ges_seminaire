import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './Auth.guard';



@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

// @Post('signup')
// async Signup(@Body() userCreate){
// return this.authService.signUp(userCreate)
// }



@Post('signIn')
async SignIn(@Body() usersignIn){
    return await this.authService.signIn(usersignIn)
}

// @UseGuards(AuthGuard)
@Get("getuser")
async getUser(){
    return await this.authService.getuser()
}
}


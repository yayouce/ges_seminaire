import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { personSigninDto } from 'src/personne/dto/personSignIn';
import { SuperAdminSignInDto } from './dto/superadmin-signin.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

// @Post('signup')
// async Signup(@Body() userCreate){
// return this.authService.signUp(userCreate)
// }



@Post('signIn')
@ApiOperation({
  summary: 'Connexion des membres de commission',
  description: 'Permet aux membres de commission de se connecter avec leur numéro de téléphone et mot de passe'
})
@ApiResponse({
  status: 200,
  description: 'Connexion réussie. Retourne les informations de l\'utilisateur et un token JWT.',
  schema: {
    example: {
      user: {
        idpers: 'uuid',
        phonePers: '+221701234567',
        rolePers: 'Accueil',
        roleMembre: 'RESP'
      },
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  }
})
@ApiResponse({ status: 404, description: 'Numéro ou mot de passe incorrect' })
async SignIn(@Body() usersignIn:personSigninDto){
    return await this.authService.signIn(usersignIn)
}

@Post('signIn/superadmin')
@ApiOperation({
  summary: 'Connexion des superadmins',
  description: 'Permet aux superadmins de se connecter avec leur login et mot de passe. Les superadmins ont tous les droits dans le système.'
})
@ApiResponse({
  status: 200,
  description: 'Connexion réussie. Retourne les informations du superadmin et un token JWT.',
  schema: {
    example: {
      user: {
        loginSupAdmin: 'admin',
        idSupAdmin: 'uuid',
        role: 'SUPERADMIN'
      },
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  }
})
@ApiResponse({ status: 404, description: 'Login ou mot de passe incorrect' })
async SignInSuperAdmin(@Body() superadminSignIn: SuperAdminSignInDto){
    return await this.authService.signInSuperAdmin(superadminSignIn)
}

// @UseGuards(AuthGuard)
@Get("getuser")
@ApiOperation({
  summary: 'Récupérer tous les utilisateurs',
  description: 'Retourne la liste de toutes les personnes enregistrées dans le système'
})
@ApiResponse({ status: 200, description: 'Liste des utilisateurs récupérée avec succès' })
async getUser(){
    return await this.authService.getuser()
}
}


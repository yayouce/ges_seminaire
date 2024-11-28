import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR; // Valeur par défaut
    let message = 'Une erreur interne est survenue.'; // Message par défaut

    // Gérer différentes exceptions avec des messages personnalisés
    if (exception instanceof QueryFailedError && exception.message.includes('unique constraint')) {
      status = HttpStatus.CONFLICT;
      message = 'Cette donnée existe déjà.';
    } else if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      message = 'Accès non autorisé. Veuillez vérifier vos identifiants.';
    } else if (exception instanceof HttpException) {
      // Pour toutes autres exceptions HTTP (ex: BadRequest, Forbidden, etc.)
      status = exception.getStatus();
      message = exception.message || exception.getResponse()['message'];
    }
  

    response.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
    });
  }
}

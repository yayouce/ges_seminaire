import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonneService } from './personne.service';

@Controller('personne')
export class PersonneController {
  constructor(private readonly personneService: PersonneService) {}


  
}

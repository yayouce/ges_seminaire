import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonneService } from './personne.service';
import { CreatePersonneDto } from './dto/create-personne.dto';
import { UpdatePersonneDto } from './dto/update-personne.dto';

@Controller('personne')
export class PersonneController {
  constructor(private readonly personneService: PersonneService) {}


  
}

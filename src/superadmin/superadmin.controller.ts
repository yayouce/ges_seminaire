import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuperadminService } from './superadmin.service';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';

@ApiTags('Superadmin')
@Controller('superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un nouveau superadmin',
    description: 'Permet de créer un nouveau compte superadmin avec login et mot de passe. Le mot de passe sera automatiquement hashé.'
  })
  @ApiResponse({
    status: 201,
    description: 'Superadmin créé avec succès',
    schema: {
      example: {
        idSupAdmin: 'uuid',
        loginSupAdmin: 'admin',
        motPassSupAdmin: '$2b$10$hashed_password...'
      }
    }
  })
  create(@Body() createSuperadminDto: CreateSuperadminDto) {
    return this.superadminService.create(createSuperadminDto);
  }


}

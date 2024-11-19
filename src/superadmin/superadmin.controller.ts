import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { CreateSuperadminDto } from './dto/create-superadmin.dto';
import { UpdateSuperadminDto } from './dto/update-superadmin.dto';

@Controller('superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) {}

  @Post()
  create(@Body() createSuperadminDto: CreateSuperadminDto) {
    return this.superadminService.create(createSuperadminDto);
  }

  
}

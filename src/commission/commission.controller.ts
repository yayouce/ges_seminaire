import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { User } from 'src/decorator/user.decorator';
import { MembreCoEntity } from 'src/membre_co/entities/membre_co.entity';

@Controller('commission')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @Post("add")
  async create(
    
    @Body() createCommissionDto: CreateCommissionDto,
   
  ) {
    return this.commissionService.createCommision(createCommissionDto);
  }

}

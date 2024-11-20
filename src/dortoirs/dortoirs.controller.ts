import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DortoirsService } from './dortoirs.service';
import { CreateDortoirDto } from './dto/create-dortoir.dto';
import { UpdateDortoirDto } from './dto/update-dortoir.dto';
import { User } from 'src/decorator/user.decorator';
import { JwtAuthGuard } from 'src/Auth/jwt-auth.guard';

@Controller('dortoirs')
export class DortoirsController {

  
  constructor(
    
    private readonly dortoirsService: DortoirsService)

    
    {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  create(
    @Body() createDortoirDto: CreateDortoirDto,
    @User() user
  ) {
    return this.dortoirsService.createDortoir(createDortoirDto,user);
  }


 

  @Get()
  findAll() {
    return this.dortoirsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dortoirsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDortoirDto: UpdateDortoirDto) {
    return this.dortoirsService.update(+id, updateDortoirDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dortoirsService.remove(+id);
  }
}

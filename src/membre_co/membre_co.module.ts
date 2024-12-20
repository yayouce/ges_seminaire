import { Module } from '@nestjs/common';
import { MembreCoService } from './membre_co.service';
import { MembreCoController } from './membre_co.controller';
import { MembreCoEntity } from './entities/membre_co.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionModule } from 'src/commission/commission.module';
import { JwtCustomModule } from 'src/Auth/jwt.module';

@Module({
  imports:[TypeOrmModule.forFeature([MembreCoEntity]),CommissionModule,JwtCustomModule],
  controllers: [MembreCoController],
  providers: [MembreCoService],
  exports:[MembreCoService]
})
export class MembreCoModule {}

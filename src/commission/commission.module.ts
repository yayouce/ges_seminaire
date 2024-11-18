import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CommissionController } from './commission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommissionEntity } from './entities/commission.entity';
import { JwtCustomModule } from 'src/Auth/jwt.module';

@Module({
  imports:[TypeOrmModule.forFeature([CommissionEntity]),JwtCustomModule],
  controllers: [CommissionController],
  providers: [CommissionService],
  exports:[CommissionService]
})
export class CommissionModule {}

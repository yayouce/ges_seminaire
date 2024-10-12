import { Module } from '@nestjs/common';
import { DortoirsService } from './dortoirs.service';
import { DortoirsController } from './dortoirs.controller';

@Module({
  controllers: [DortoirsController],
  providers: [DortoirsService],
})
export class DortoirsModule {}

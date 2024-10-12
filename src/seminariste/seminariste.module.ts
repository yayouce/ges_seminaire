import { Module } from '@nestjs/common';
import { SeminaristeService } from './seminariste.service';
import { SeminaristeController } from './seminariste.controller';

@Module({
  controllers: [SeminaristeController],
  providers: [SeminaristeService],
})
export class SeminaristeModule {}

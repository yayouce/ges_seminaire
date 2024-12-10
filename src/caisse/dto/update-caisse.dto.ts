import { PartialType } from '@nestjs/swagger';
import { CreateCaisseDto } from './create-caisse.dto';

export class UpdateCaisseDto extends PartialType(CreateCaisseDto) {}

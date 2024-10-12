import { PartialType } from '@nestjs/mapped-types';
import { CreateVisiteurDto } from './create-visiteur.dto';

export class UpdateVisiteurDto extends PartialType(CreateVisiteurDto) {}

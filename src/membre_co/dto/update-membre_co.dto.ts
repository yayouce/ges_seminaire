import { PartialType } from '@nestjs/mapped-types';
import { CreateMembreCoDto } from './create-membre_co.dto';

export class UpdateMembreCoDto extends PartialType(CreateMembreCoDto) {}

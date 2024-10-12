import { PartialType } from '@nestjs/mapped-types';
import { CreateSeminaristeDto } from './create-seminariste.dto';

export class UpdateSeminaristeDto extends PartialType(CreateSeminaristeDto) {}

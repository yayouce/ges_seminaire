import { PartialType } from '@nestjs/mapped-types';
import { CreateDortoirDto } from './create-dortoir.dto';

export class UpdateDortoirDto extends PartialType(CreateDortoirDto) {}

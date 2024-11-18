import { SetMetadata } from '@nestjs/common';
import { responsabilite } from 'generique/responsabilite.enum';


export const ROLES_KEY = 'roles';
export const Roles = (...roles: responsabilite[]) => SetMetadata(ROLES_KEY, roles);
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SuperAdminSignInDto {
  @ApiProperty({
    description: 'Login du superadmin',
    example: 'admin',
  })
  @IsString()
  loginSupAdmin: string;

  @ApiProperty({
    description: 'Mot de passe du superadmin',
    example: 'password123',
  })
  @IsString()
  motPassSupAdmin: string;
}

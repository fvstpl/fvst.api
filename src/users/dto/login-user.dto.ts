import { IsEmail, IsIP, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isIPv4 } from 'net';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIP()
  @IsString()
  ip?: string;
}

import { IsNotEmpty, IsEmail } from 'class-validator';

export class ResetRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

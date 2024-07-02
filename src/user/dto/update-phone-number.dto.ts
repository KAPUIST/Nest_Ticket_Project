import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdatePhoneNumberDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phoneNumber: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UpdatePhoneNumberDto {
  @ApiProperty({ description: '기존 비밀번호', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '새로운 전화번호', example: '010-1234-5678' })
  @IsNotEmpty()
  @IsPhoneNumber('KR')
  phoneNumber: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '사용자 이름', example: 'lukas' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '비밀번호', example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

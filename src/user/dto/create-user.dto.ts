import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이름', example: 'lukas' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '이메일', example: 'testuser@example.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: '이름', example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: '성', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678' })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('KR')
  phoneNumber: string;
}

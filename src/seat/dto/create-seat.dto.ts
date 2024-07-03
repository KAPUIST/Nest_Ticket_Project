import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsArray, IsNumber, Min, Max, ValidateNested, IsEnum } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty({ description: '좌석 번호' })
  @IsNotEmpty()
  @IsString()
  seatNumber: string;

  @ApiProperty({ description: '행 번호' })
  @IsNotEmpty()
  @IsNumber()
  row: number;

  @ApiProperty({ description: '열 번호' })
  @IsNotEmpty()
  @IsNumber()
  column: number;

  @ApiProperty({ description: '좌석 가격', minimum: 0, maximum: 50000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(50000)
  price: number;
}

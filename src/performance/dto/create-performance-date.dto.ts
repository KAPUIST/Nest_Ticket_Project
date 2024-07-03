import { IsNotEmpty, IsString, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSeatDto } from 'src/seat/dto/create-seat.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePerformanceDateDto {
  @ApiProperty({ description: '공연 날짜' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ description: '공연 시간' })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({ description: '취소 가능 날짜' })
  @IsNotEmpty()
  @IsString()
  cancelableDate: string;

  @ApiProperty({ description: '좌석 정보', type: [CreateSeatDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeatDto)
  seats: CreateSeatDto[];
}

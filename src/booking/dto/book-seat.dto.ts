import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class BookSeatDto {
  @ApiProperty({ description: '공연 ID' })
  @IsNotEmpty()
  @IsNumber()
  performanceId: number;

  @ApiProperty({ description: '공연 날짜 ID' })
  @IsNotEmpty()
  @IsNumber()
  performanceDateId: number;

  @ApiProperty({ description: '좌석 ID' })
  @IsNotEmpty()
  @IsNumber()
  seatId: number;
}

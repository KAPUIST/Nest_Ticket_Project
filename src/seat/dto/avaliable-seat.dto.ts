import { ApiProperty } from '@nestjs/swagger';
import { Seat } from 'src/seat/entities/seat.entity';

export class AvailableSeatDto {
  @ApiProperty({ description: '공연 날짜' })
  date: string;

  @ApiProperty({ description: '공연 시간' })
  time: string;

  @ApiProperty({ description: '취소 가능한 날짜 및 시간' })
  cancelableDate: string;

  @ApiProperty({ description: '좌석 목록', type: [Seat] })
  seats: Seat[];
}

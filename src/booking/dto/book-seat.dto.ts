import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class BookSeatDto {
  @IsNotEmpty()
  @IsNumber()
  performanceId: number;

  @IsNotEmpty()
  @IsNumber()
  performanceDateId: number;

  @IsNotEmpty()
  @IsNumber()
  seatId: number;
}

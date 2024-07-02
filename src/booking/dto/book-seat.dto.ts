import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookSeatDto {
  @IsNotEmpty()
  @IsNumber()
  seatId: number;
}

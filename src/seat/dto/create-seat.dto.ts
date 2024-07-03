import { IsNotEmpty, IsString, IsDate, IsArray, IsNumber, Min, Max, ValidateNested, IsEnum } from 'class-validator';

export class CreateSeatDto {
  @IsNotEmpty()
  @IsString()
  seatNumber: string;

  @IsNotEmpty()
  @IsNumber()
  row: number;

  @IsNotEmpty()
  @IsNumber()
  column: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(50000)
  price: number;
}

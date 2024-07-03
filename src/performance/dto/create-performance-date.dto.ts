import { IsNotEmpty, IsString, IsArray, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSeatDto } from 'src/seat/dto/create-seat.dto';

export class CreatePerformanceDateDto {
  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  time: string; // HH:MM

  @IsNotEmpty()
  @IsDateString()
  cancelableDate: string; // ISO format

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeatDto)
  seats: CreateSeatDto[];
}

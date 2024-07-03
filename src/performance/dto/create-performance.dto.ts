import { IsNotEmpty, IsString, IsDate, IsArray, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { PerformanceCategory } from '../types/performance-category.enum';
import { Type } from 'class-transformer';
import { CreateSeatDto } from 'src/seat/dto/create-seat.dto';

export class CreatePerformanceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(PerformanceCategory)
  category: PerformanceCategory;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => Date)
  @IsDate({ each: true })
  dates: Date[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeatDto)
  seats: CreateSeatDto[];
}

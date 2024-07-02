import { IsNotEmpty, IsString, IsDate, IsArray, IsNumber, IsEnum } from 'class-validator';
import { PerformanceCategory } from '../types/performance-category.enum';
import { Type } from 'class-transformer';

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
  @IsNotEmpty({ each: true })
  seats: { row: number; column: number; seatNumber: string; price: number }[];
}

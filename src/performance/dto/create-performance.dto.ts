import { IsNotEmpty, IsString, IsDate, IsArray, IsNumber, IsEnum, ValidateNested } from 'class-validator';
import { PerformanceCategory } from '../types/performance-category.enum';
import { Type } from 'class-transformer';
import { CreatePerformanceDateDto } from './create-performance-date.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePerformanceDto {
  @ApiProperty({ description: '공연 제목', example: '2024 여름 음악 축제' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '공연 설명', example: '2024 여름 음악 축제에서 잊지 못할 밤을 보내세요.' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: '공연 카테고리', enum: PerformanceCategory, example: PerformanceCategory.CONCERT })
  @IsNotEmpty()
  @IsEnum(PerformanceCategory)
  category: PerformanceCategory;

  @ApiProperty({ description: '공연장', example: '서울 올림픽 경기장' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: '공연 이미지 주소',
    example: 'https://wimg.mk.co.kr/news/cms/202405/29/news-p.v1.20240529.fe1ddf47acb84a8ca129f25eaca2b26c_R.jpg',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({ description: '공연 시간 및 좌석', type: [CreatePerformanceDateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePerformanceDateDto)
  dates: CreatePerformanceDateDto[];
}

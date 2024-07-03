import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { PerformanceCategory } from './types/performance-category.enum';
import { Seat } from 'src/seat/entities/seat.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AvailableSeatDto } from 'src/seat/dto/avaliable-seat.dto';

@ApiTags('공연')
@Controller('api/performances')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '새로운 공연을 생성합니다.' })
  @ApiResponse({ status: 201, description: '성공적으로 공연을 생성했습니다.' })
  @ApiResponse({ status: 403, description: '권한이 존재하지않습니다.' })
  @ApiBody({
    type: CreatePerformanceDto,
    description: '공연 정보',
    examples: {
      example1: {
        summary: '예시 1',
        value: {
          title: '2024 여름 음악 축제',
          description: '2024 여름 음악 축제에서 잊지 못할 밤을 보내세요.',
          category: 'CONCERT',
          location: '서울 올림픽 경기장',
          image: 'https://wimg.mk.co.kr/news/cms/202405/29/news-p.v1.20240529.fe1ddf47acb84a8ca129f25eaca2b26c_R.jpg',
          dates: [
            {
              date: '2024-10-04',
              time: '19:00',
              cancelableDate: '2024-10-01T19:00:00Z',
              seats: [
                { seatNumber: 'A1', row: 1, column: 1, price: 10000 },
                { seatNumber: 'A2', row: 1, column: 2, price: 10000 },
              ],
            },
            {
              date: '2024-10-05',
              time: '19:00',
              cancelableDate: '2024-10-02T19:00:00Z',
              seats: [
                { seatNumber: 'B1', row: 2, column: 1, price: 15000 },
                { seatNumber: 'B2', row: 2, column: 2, price: 15000 },
              ],
            },
          ],
        },
      },
    },
  })
  @Post()
  async createPerformance(@Body() createPerformanceDto: CreatePerformanceDto) {
    return this.performanceService.createPerformance(createPerformanceDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '공연 세부 정보' })
  @ApiResponse({ status: 200, description: '공연을 돌려줍니다.' })
  @ApiResponse({ status: 404, description: '공연을 찾지 못했습니다.' })
  async findOne(@Param('id') id: number) {
    return this.performanceService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: '모든 공연을 찾습니다.' })
  @ApiResponse({ status: 200, description: '모든 공연을 돌려줍니다.' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: PerformanceCategory,
    description: '공연 카테고리 (예: CONCERT, THEATER, MUSICAL, OPERA, DANCE, EXHIBITION)',
  })
  async findAll(@Query('category') category?: PerformanceCategory) {
    if (category) {
      return this.performanceService.findByCategory(category);
    }
    return this.performanceService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: '공연을 검색합니다.' })
  @ApiResponse({ status: 200, description: '일치하는 공연을 돌려줍니다.' })
  async search(@Query('search') search: string) {
    return this.performanceService.searchPerformances(search);
  }
  @Get(':id/available-seats')
  @ApiOperation({ summary: '남아있는 공연 좌석을 찾습니다.' })
  @ApiResponse({ status: 200, description: '남아있는 좌석을 돌려줍니다.' })
  async findAvailableSeats(@Param('id') performanceId: number): Promise<AvailableSeatDto[]> {
    return this.performanceService.findAvailableSeats(performanceId);
  }
}

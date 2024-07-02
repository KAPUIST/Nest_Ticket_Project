import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { PerformanceCategory } from './types/performance-category.enum';
import { Seat } from 'src/seat/entities/seat.entity';

@Controller('api/performances')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async createPerformance(@Body() createPerformanceDto: CreatePerformanceDto) {
    return this.performanceService.createPerformance(createPerformanceDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.performanceService.findOne(id);
  }

  @Get()
  async findAll(@Query('category') category?: PerformanceCategory) {
    if (category) {
      return this.performanceService.findByCategory(category);
    }
    return this.performanceService.findAll();
  }

  @Get('search')
  async search(@Query('search') search: string) {
    return this.performanceService.searchPerformances(search);
  }
  @Get(':id/available-seats')
  async findAvailableSeats(@Param('id') performanceId: number): Promise<Seat[]> {
    return this.performanceService.findAvailableSeats(performanceId);
  }
}

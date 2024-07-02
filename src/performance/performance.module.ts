import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceDate } from './entities/performance-date.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Performance } from './entities/performance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Performance, PerformanceDate, Seat])],
  providers: [PerformanceService],
  controllers: [PerformanceController],
})
export class PerformanceModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import _ from 'lodash';
import { Seat } from 'src/seat/entities/seat.entity';
import { PerformanceDate } from './entities/performance-date.entity';
import { Performance } from './entities/performance.entity';
import { PerformanceCategory } from './types/performance-category.enum';
import { AvailableSeatDto } from 'src/seat/dto/avaliable-seat.dto';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,
    @InjectRepository(PerformanceDate)
    private readonly performanceDateRepository: Repository<PerformanceDate>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async createPerformance(createPerformanceDto: CreatePerformanceDto): Promise<Performance> {
    const { title, description, category, location, image, dates } = createPerformanceDto;

    // 공연 생성
    const performance = this.performanceRepository.create({
      title,
      description,
      category,
      location,
      image,
    });
    await this.performanceRepository.save(performance);

    // 공연 날짜 및 좌석 생성
    for (const dateDto of dates) {
      const performanceDate = this.performanceDateRepository.create({
        date: dateDto.date,
        time: dateDto.time,
        cancelableDate: dateDto.cancelableDate,
        performance,
      });
      await this.performanceDateRepository.save(performanceDate);

      for (const seatDto of dateDto.seats) {
        const seat = this.seatRepository.create({
          ...seatDto,
          performance,
          performanceDate,
        });
        await this.seatRepository.save(seat);
      }
    }

    return this.performanceRepository.findOne({
      where: { id: performance.id },
      relations: ['dates', 'dates.seats'],
    });
  }

  async findAll(): Promise<Performance[]> {
    return this.performanceRepository.find();
  }

  async findOne(id: number): Promise<Performance> {
    const performance = await this.performanceRepository.findOne({
      where: { id },
      relations: ['dates'],
    });
    if (_.isNil(performance)) {
      throw new NotFoundException('공연을 찾을수 없습니다.');
    }
    return performance;
  }

  async findByCategory(category: PerformanceCategory): Promise<Performance[]> {
    return this.performanceRepository.find({
      where: { category },
    });
  }

  async searchPerformances(term: string): Promise<Performance[]> {
    return this.performanceRepository
      .createQueryBuilder('performance')
      .where('performance.title LIKE :term', { term: `%${term}%` })
      .orWhere('performance.description LIKE :term', { term: `%${term}%` })
      .getMany();
  }
  async findAvailableSeats(performanceId: number): Promise<AvailableSeatDto[]> {
    const performance = await this.performanceRepository.findOne({
      where: { id: performanceId },
      relations: ['dates', 'dates.seats'],
    });
    if (!performance) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }

    const availableSeats: AvailableSeatDto[] = [];

    for (const date of performance.dates) {
      const availableSeatsForDate = date.seats.filter((seat) => !seat.isBooked);
      if (availableSeatsForDate.length > 0) {
        availableSeats.push({
          date: date.date,
          time: date.time,
          cancelableDate: date.cancelableDate,
          seats: availableSeatsForDate,
        });
      }
    }

    return availableSeats;
  }
}

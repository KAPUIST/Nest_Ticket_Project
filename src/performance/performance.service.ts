import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import _ from 'lodash';
import { Seat } from 'src/seat/entities/seat.entity';
import { PerformanceDate } from './entities/performance-date.entity';
import { Performance } from './entities/performance.entity';
import { PerformanceCategory } from './types/performance-category.enum';

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
    const { title, description, category, location, image, dates, seats } = createPerformanceDto;

    // 공연 생성
    const performance = this.performanceRepository.create({
      title,
      description,
      category,
      location,
      image,
    });
    await this.performanceRepository.save(performance);

    const performanceDates = dates.map((date) => this.performanceDateRepository.create({ date, performance }));
    await this.performanceDateRepository.save(performanceDates);

    const seatEntities = seats.map((seatData) => this.seatRepository.create({ ...seatData, performance }));
    await this.seatRepository.save(seatEntities);

    return this.performanceRepository.findOne({
      where: { id: performance.id },
      relations: ['dates', 'seats'],
    });
  }

  async findAll(): Promise<Performance[]> {
    return this.performanceRepository.find();
  }

  async findOne(id: number): Promise<Performance> {
    const performance = await this.performanceRepository.findOne({ where: { id }, relations: ['seats', 'bookings'] });
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
  async findAvailableSeats(performanceId: number): Promise<Seat[]> {
    const seats = await this.seatRepository.find({
      where: { performance: { id: performanceId }, isBooked: false },
    });
    if (!seats.length) {
      throw new NotFoundException('예매 가능한 좌석을 찾을 수 없습니다.');
    }
    return seats;
  }
}

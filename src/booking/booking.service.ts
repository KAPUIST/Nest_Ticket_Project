import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { BookSeatDto } from './dto/book-seat.dto';
import _ from 'lodash';
import { Performance } from 'src/performance/entities/performance.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { BookingStatus } from './types/booking-status.enum';
import { PaymentStatus } from 'src/payment/types/payment-status.enum';
import moment from 'moment';
import { PerformanceDate } from 'src/performance/entities/performance-date.entity';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly paymentService: PaymentService,
    private readonly dataSource: DataSource,
  ) {}

  async bookSeat(userId: number, bookSeatDto: BookSeatDto): Promise<Booking> {
    const { performanceId, performanceDateId, seatId } = bookSeatDto;
    return await this.dataSource.transaction(async (tx) => {
      const user = await tx.findOne(User, { where: { id: userId } });

      if (_.isNil(user)) {
        this.logger.log(`Starting booking process for user ${userId} and seat ${seatId}`);
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }

      const performance = await tx.findOne(Performance, { where: { id: performanceId } });
      if (_.isNil(performance)) {
        this.logger.log(`Performance not found: ${performanceId}`);
        throw new NotFoundException('공연을 찾을 수 없습니다.');
      }

      const performanceDate = await tx.findOne(PerformanceDate, { where: { id: performanceDateId } });

      if (_.isNil(performanceDate)) {
        this.logger.log(`Performance date not found: ${performanceDateId}`);
        throw new NotFoundException('공연 시간을 찾을 수 없습니다.');
      }

      const seat = await tx.findOne(Seat, {
        where: { id: seatId, performanceDate: { id: performanceDateId } },
        lock: { mode: 'pessimistic_write' },
      });

      if (_.isNil(seat)) {
        this.logger.log(`Seat not found: ${seatId}`);
        throw new NotFoundException('좌석을 찾을 수 없습니다.');
      }

      if (seat.isBooked) {
        this.logger.log(`Seat already booked: ${seatId}`);
        throw new ConflictException('이미 예매된 좌석입니다.');
      }

      if (user.points < seat.price) {
        this.logger.log(`Not enough points for user ${userId}`);
        throw new BadRequestException('보유 포인트가 부족합니다.');
      }

      seat.isBooked = true;
      await tx.save(seat);

      user.points -= seat.price;
      await tx.save(user);

      const booking = this.bookingRepository.create({
        user,
        performance,
        performanceDate,
        seat,
        bookingDate: new Date(),
        status: BookingStatus.CONFIRMED,
      });

      await tx.save(booking);
      await this.paymentService.createPayment(user.id, booking.id, seat.price, tx);

      this.logger.log(`Booking completed for user ${userId} and seat ${seatId}`);
      return booking;
    });
  }

  async cancelBooking(bookingId: number, userId: number): Promise<void> {
    return await this.dataSource.transaction(async (tx) => {
      this.logger.log(`Starting cancel process for booking ${bookingId} by user ${userId}`);

      const booking = await tx.findOne(Booking, {
        where: { id: bookingId },
        relations: ['user', 'seat', 'performanceDate'],
      });
      if (_.isNil(booking)) {
        this.logger.log(`Booking not found: ${bookingId}`);
        throw new NotFoundException('예매 내역을 조회할 수 없습니다.');
      }
      if (booking.user.id !== userId) {
        this.logger.log(`Unauthorized cancellation attempt by user ${userId}`);
        throw new ConflictException('본인의 예매건만 취소할 수 있습니다.');
      }

      if (booking.status === BookingStatus.REFUNDED) {
        this.logger.log(`Booking already refunded: ${bookingId}`);
        throw new ConflictException('이미 환불된 예매입니다.');
      }
      const performanceDate = booking.performanceDate; // 예매한 공연 날짜와 시간
      const performanceDateTime = moment(`${performanceDate.date} ${performanceDate.time}`, 'YYYY-MM-DD HH:mm');
      const cancelableDateTime = performanceDateTime.subtract(3, 'hours');
      if (moment().isAfter(cancelableDateTime)) {
        throw new ConflictException('예매 취소 가능 시간을 초과했습니다.');
      }
      const payment = await tx.findOne(Payment, { where: { booking: { id: bookingId } } });

      if (_.isNil(payment)) {
        this.logger.log(`Payment record not found for booking ${bookingId}`);
        throw new NotFoundException('결제 기록을 찾을 수 없습니다.');
      }

      payment.status = PaymentStatus.REFUNDED;
      await tx.save(payment);
      const user = await tx.findOne(User, { where: { id: userId } });
      user.points += payment.amount;
      await tx.save(user);

      const seat = booking.seat;
      seat.isBooked = false;
      await tx.save(seat);
      booking.status = BookingStatus.REFUNDED;

      await tx.save(booking);
      this.logger.log(`Cancellation completed for booking ${bookingId} by user ${userId}`);
    });
  }
  async findUserBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['performance', 'performanceDate', 'seat'],
      order: { bookingDate: 'DESC' },
    });
  }
}

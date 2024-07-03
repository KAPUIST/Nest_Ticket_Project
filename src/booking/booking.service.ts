import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly paymentService: PaymentService,
    private readonly dataSource: DataSource,
  ) {}

  async bookSeat(userId: number, performanceId: number, bookSeatDto: BookSeatDto): Promise<Booking> {
    const { seatId } = bookSeatDto;
    return await this.dataSource.transaction(async (tx) => {
      const user = await tx.findOne(User, { where: { id: userId } });
      console.log(user);
      if (!user) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
      }

      const performance = await tx.findOne(Performance, { where: { id: performanceId } });
      if (!performance) {
        throw new NotFoundException('공연을 찾을 수 없습니다.');
      }

      const seat = await tx.findOne(Seat, {
        where: { id: seatId },
        lock: { mode: 'pessimistic_write' },
      });
      if (_.isNil(seat)) {
        throw new NotFoundException('좌석을 찾을 수 없습니다.');
      }

      if (seat.isBooked) {
        throw new ConflictException('이미 예매된 좌석입니다.');
      }

      if (user.points < seat.price) {
        throw new BadRequestException('보유 포인트가 부족합니다.');
      }

      seat.isBooked = true;
      await tx.save(seat);

      user.points -= seat.price;
      await tx.save(user);

      const booking = this.bookingRepository.create({
        user,
        performance,
        seat,
        bookingDate: new Date(),
        status: BookingStatus.CONFIRMED,
      });

      await tx.save(booking);
      await this.paymentService.createPayment(user.id, booking.id, seat.price, tx);

      return booking;
    });
  }

  async cancelBooking(bookingId: number, userId: number): Promise<void> {
    return await this.dataSource.transaction(async (tx) => {
      const booking = await tx.findOne(Booking, { where: { id: bookingId }, relations: ['user', 'seat'] });
      if (_.isNil(booking)) {
        throw new NotFoundException('예매 내역을 조회할 수 없습니다.');
      }
      if (booking.user.id !== userId) {
        throw new ConflictException('본인의 예매건만 취소할 수 있습니다.');
      }

      if (booking.status === BookingStatus.REFUNDED) {
        throw new ConflictException('이미 환불된 예매입니다.');
      }

      const payment = await tx.findOne(Payment, { where: { booking: { id: bookingId } } });
      if (_.isNil(payment)) {
        throw new NotFoundException('결재 기록을 찾을 수 없습니다.');
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
    });
  }
}

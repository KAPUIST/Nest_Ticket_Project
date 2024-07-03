import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import _ from 'lodash';
import { PaymentStatus } from './types/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}
  async createPayment(userId: number, bookingId: number, amount: number, tx: any): Promise<Payment> {
    const user = await tx.findOneBy(User, { id: userId });
    if (_.isNil(user)) {
      throw new Error('유저가 존재하지 않습니다.');
    }

    const booking = await tx.findOneBy(Booking, { id: bookingId });
    if (_.isNil(booking)) {
      throw new Error('예매 기록이 존재하지않습니다.');
    }

    const payment = this.paymentRepository.create({
      user,
      booking,
      amount,
      status: PaymentStatus.COMPLETED,
    });

    return tx.save(payment);
  }
}

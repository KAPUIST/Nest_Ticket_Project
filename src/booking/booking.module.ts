import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { PaymentService } from 'src/payment/payment.service';
import { User } from 'src/user/entities/user.entity';
import { Seat } from 'src/seat/entities/seat.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Seat, Performance, Payment])],
  providers: [BookingService, PaymentService],
  controllers: [BookingController],
})
export class BookingModule {}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Performance } from '../../performance/entities/performance.entity';
import { Seat } from '../../seat/entities/seat.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { BookingStatus } from '../types/booking-status.enum';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bookingDate: Date;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @ManyToOne(() => Performance, (performance) => performance.bookings)
  performance: Performance;

  @ManyToOne(() => Seat, (seat) => seat.bookings, { nullable: true })
  seat: Seat;

  @OneToOne(() => Payment, (payment) => payment.booking, { cascade: true })
  payment: Payment;

  @CreateDateColumn()
  createdAt: Date;
}

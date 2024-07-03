import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { PaymentStatus } from '../types/payment-status.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @OneToOne(() => Booking)
  @JoinColumn()
  booking: Booking;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}

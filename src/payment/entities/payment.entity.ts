import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @OneToOne(() => Booking)
  @JoinColumn()
  booking: Booking;

  @Column()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;
}

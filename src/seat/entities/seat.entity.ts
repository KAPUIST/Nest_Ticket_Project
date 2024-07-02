import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Performance } from '../../performance/entities/performance.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seatNumber: string;

  @Column()
  isBooked: boolean;

  @Column()
  row: number;

  @Column()
  price: number;

  @Column()
  column: number;

  @ManyToOne(() => Performance, (performance) => performance.seats)
  performance: Performance;

  @OneToMany(() => Booking, (booking) => booking.seat)
  bookings: Booking[];
}

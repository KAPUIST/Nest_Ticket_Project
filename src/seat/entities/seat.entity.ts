import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Performance } from '../../performance/entities/performance.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { PerformanceDate } from 'src/performance/entities/performance-date.entity';

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
  column: number;

  @Column()
  price: number;

  @ManyToOne(() => Performance, (performance) => performance.seats)
  performance: Performance;

  @ManyToOne(() => PerformanceDate, (performanceDate) => performanceDate.seats)
  performanceDate: PerformanceDate;

  @OneToMany(() => Booking, (booking) => booking.seat)
  bookings: Booking[];
}

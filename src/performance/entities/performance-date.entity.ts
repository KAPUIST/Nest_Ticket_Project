import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Performance } from './performance.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Seat } from 'src/seat/entities/seat.entity';

@Entity('performance_dates')
export class PerformanceDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  cancelableDate: string;

  @ManyToOne(() => Performance, (performance) => performance.dates, {
    onDelete: 'CASCADE',
  })
  performance: Performance;

  @OneToMany(() => Booking, (booking) => booking.performanceDate)
  bookings: Booking[];

  @OneToMany(() => Seat, (seat) => seat.performanceDate)
  seats: Seat[];
}

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PerformanceStatus } from '../types/performance.type';
import { Seat } from 'src/seat/entities/seat.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { PerformanceDate } from './performance-date.entity';
import { PerformanceCategory } from '../types/performance-category.enum';

@Entity({ name: 'performances' })
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @OneToMany(() => PerformanceDate, (performanceDate) => performanceDate.performance, { cascade: true })
  dates: PerformanceDate[];

  @Column({
    type: 'enum',
    enum: PerformanceStatus,
    default: PerformanceStatus.SCHEDULED,
  })
  status: PerformanceStatus;

  @Column({
    type: 'enum',
    enum: PerformanceCategory,
  })
  category: PerformanceCategory;

  @Column()
  image: string;

  @OneToMany(() => Seat, (seat) => seat.performance)
  seats: Seat[];

  @OneToMany(() => Booking, (booking) => booking.performance)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Performance } from './performance.entity';

@Entity('performance_dates')
export class PerformanceDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Performance, (performance) => performance.dates, {
    onDelete: 'CASCADE',
  })
  performance: Performance;
}
